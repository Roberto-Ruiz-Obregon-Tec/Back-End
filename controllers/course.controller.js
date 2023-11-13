const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Course = require('../models/courses.model');
const Focus = require('../models/focus.model'); // Schema to perform .populate("focus")
const CourseFocus = require('../models/courseFocus.model');
const UserCourse = require('../models/userCourse.model');
const CommentCourse = require('../models/commentCourse.model');
const Comment = require('../models/comments.model');
const User = require('../models/users.model');
const Inscription = require('../models/inscriptions.model');
const Email = require('../utils/email');
const mongoose = require('mongoose');
const { request } = require('express');
const { populate } = require('../models/inscriptions.model');
const { user } = require('firebase-functions/v1/auth');

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const data = [] // Documentos a retornar
    let reqFocus = req.body.focus || [] // Filtros de focus (en caso de no existir, lista vacía)
    
    const features = new APIFeatures(Course.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const documents = await features.query; // Cursos que cumplen con los filtros de los params del URL

    const courseFocus = await CourseFocus.find().populate("focus"); // Registros de los focus asociados a los cursos
    const courseComments = await CommentCourse.find().populate("comment").populate([
        { 
          path: 'comment', 
          populate: [{ path: 'user' }] 
        }
      ]); // Registros de los comentarios asociados a los cursos

console.log(courseComments)

    for(let i = 0; i < documents.length; i++) { // Iteramos sobre cada curso
        // 1. Comentarios asociados
        let comments = courseComments.filter(comment => comment.course.toString() == documents[i]._id.toString() && comment.comment.status == 'Aprobado');
        let approvedComments = [];

        comments.forEach( c => { // Agarramos únicamente los comentarios
            approvedComments.push({"comment": c.comment.comment, "user": c.comment.user.firstName + " " + c.comment.user.lastName});
        });

        documents[i]._doc = {...documents[i]._doc, "comments": approvedComments}; // Guardamos los comentarios que han sido aprobados

        // 2. Focus asociados
        let filter = (reqFocus.length == 0)?true:false // Para verificar si cumple con los filtros de focus
        const cFocus = courseFocus.filter(focusInfo => focusInfo.course.toString() == documents[i]._id.toString()); // Obtenemos los focus asociados
        
        let focus = []
        if(cFocus.length > 0) { // Si existen focus asociados entonces...
            cFocus.forEach( f => { 
                focus.push(f.focus.name) // Almacenamos el nombre
                filter = (reqFocus.includes(f.focus.name))?true:filter // Seguimos verificando si hay coincidencias de filtros
            })
        }

        if(filter) data.push({...documents[i]._doc, "focus": focus}) // Si coincide con algún focus solicitado se almacena
    }

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: data,
    });
});

exports.getCourse = catchAsync(async (req, res, next) => {
        const features = new APIFeatures(Course.findOne({ _id: req.params.id }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const document = await features.query; // Información del curso especificado en los params del URL

    const courseComments = await CommentCourse.find({course: document[0]._id}, {comment:1}).populate("comment").populate([
        { 
          path: 'comment', 
          populate: [{ path: 'user' }] 
        }
      ]); // Comentarios asociados
    let approvedComments = [];

    courseComments.forEach( c => { // Agarramos únicamente los comentarios
        if(c.comment.status == 'Aprobado') {
            approvedComments.push({"comment": c.comment.comment, "user": c.comment.user.firstName + " " + c.comment.user.lastName});
        }
    });

    document[0]._doc = {...document[0]._doc, "comments": approvedComments}; // Guardamos los comentarios que han sido aprobados

    if(document.length > 0) { // Si hay un documento...
        const cFocus = await CourseFocus.find({course: document[0]._id}, {focus:1}).populate("focus"); // Obtenemos los focus asociados

        let focus = []
        if(cFocus.length > 0) cFocus.forEach( f => { focus.push(f.focus.name) }) // Si existen focus asociados, almacenamos su nombre

        document[0] = {...document[0]._doc, "focus": focus}
    }

    res.status(200).json({
        status: 'success',
        data: document,
    });
}); 

exports.createCourse = catchAsync(async (req, res, next) => {
    const error = new AppError('No hay datos para crear el curso', 404);
    const {focus, ...courseInfo} = req.body;

    if(courseInfo === undefined) return next(error); // En caso de no recibir datos para crear un curso, manda un error

    const newCourse = await Course.create(courseInfo);
    
    if(focus) {
        const focusRecords = await Focus.find(); // Obtenemos los focus ya registrados
        const match = focusRecords.filter(record => focus.includes(record.name)) // Filtramos para buscar si hay coincidentes
        
        for(const coincidence of match) { // Para cada focus ya registrado
            await CourseFocus.create({ // Creamos la relación
                "course": newCourse._id,
                "focus": coincidence._id
            });
            focus.splice(focus.indexOf(coincidence.name), 1); // Eliminamos de los focus por registrar
        }
        
        for(const focusName of focus) { // Para cada focus no registrado
            const newFocus = await Focus.create({ // Se crea el focus
                "name": focusName
            });
            await CourseFocus.create({ // Se crea la relación
                "course": newCourse._id,
                "focus": newFocus._id
            });
        }
    }

    res.status(200).json({
        status: 'success'
    });
});

/* A function that returns all the inscriptions of a course. */
exports.inscriptionByCourse = catchAsync(async (req, res, next) => {
    const courseID = req.params.id;

    // await because is a petition to the database
    const course = await Course.findById(courseID);

    // there's no course with that id
    // 500 is a server problem, 400 user error
    if (!course) {
        return next(new AppError('No se encontró un curso con ese ID.', 404));
    }

    // return all the inscription with the same courseID
    // .populate exchange id for the document, course has ref with user model
    const inscriptions = await Inscription.find({
        course: courseID,
    }).populate('user');

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(201).json({
            status: 'success',
            data: inscriptions,
        });

    res.status(201).json({
        status: 'success',
        data: {
            documents: inscriptions,
        },
    });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe un curso con ese ID', 404);
    const {_id, focus, ...courseInfo} = req.body;

    if(!mongoose.isValidObjectId(_id)) return next(error);

    const prevCourse = await Course.findOne({"_id": _id}); // Si no se encuentra el curso
    if(!prevCourse) return next(error); // Se retorna un mensaje de error

    const keys = Object.keys(prevCourse._doc);

    for(key of keys){ // Iteramos sobre las llaves del objeto
        prevCourse[key] = courseInfo[key] || prevCourse[key]; // Se actualizan los atributos recibidos
    }

    await prevCourse.save(); // Se guardan los cambios
    
    if(focus) { // Si hay cambios en los focus
        await CourseFocus.deleteMany({course: _id}); // Borramos las relaciones existentes

        const focusRecords = await Focus.find(); // Obtenemos los focus ya registrados

        for(const focusName of focus) { // Para cada focus del update
            let match = focusRecords.find(record => record.name == focusName); // Verificamos si está registrado

            if(!match) { // Si no existe, se crea
                match = await Focus.create({
                    "name": focusName
                });
            }

            await CourseFocus.create({ // Se crea la relación
                "course": _id,
                "focus": match._id
            });
        }
    }

    res.status(200).json({
        status: 'success'
    });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe un curso con ese ID', 404);
    const filter = {course: req.params.id}

    if(!mongoose.isValidObjectId(req.params.id)) return next(error);

    // Borrar inscripciones relacionadas
    await Inscription.deleteMany(filter);

    // Borrar relaciones en userCourse
    await UserCourse.deleteMany(filter);

    // Buscar comentarios asociados al curso
    const comments = await CommentCourse.find(filter, {_id: 0, comment: 1});

    // Borrar relaciones en commentCourse
    await CommentCourse.deleteMany(filter);

    // Borrar comentarios anteriormente asociados al curso
    for(const comment of comments) {
        await Comment.findByIdAndDelete(comment.comment);
    }

    // Borrar relaciones en courseFocus
    await CourseFocus.deleteMany(filter);

    // Borrar curso
    const doc = await Course.findByIdAndDelete(req.params.id);

    if (!doc) return next(error);

    res.status(200).json({
        status: 'success'
    });
});

// A function that modifies the rating of the course with a parameter id and returns the new rating
exports.updateRating = catchAsync(async (req, res, next) => {
    const courseID = req.body.id;

    // await because is a petition to the database
    const course = await Course.findById(courseID);

    // there's no course with that id
    // 500 is a server problem, 400 user error
    if (!course) {
        return next(new AppError('No se encontró un curso con ese ID.', 404));
    }

    // get the rating of the course
    const rating = course.rating;
    
    const ratingCount = course.ratingCount;

    // get the new rating
    const newRating = req.body.rating;

    // the new rating is not a number between 0 and 5
    if (newRating < 0 || newRating > 5) {
        return next(new AppError('No es un numero valido', 404));
    }

    // calculate the new rating
    const updatedRating = (rating * ratingCount + newRating) / (ratingCount + 1);

    // update the rating of the course
    const updatedCourse = await Course.findByIdAndUpdate(
        courseID,
        { rating: updatedRating,
          ratingCount: ratingCount + 1
        },
        {
            new: true,
            runValidators: true,
        }
    );

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(201).json({
            status: 'success',
            data: updatedCourse,
        });

    res.status(201).json({
        status: 'success',
        data: {
            updatedCourse,
        },
    });
});