const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Course = require('../models/courses.model');
const Focus = require('../models/focus.model'); // Schema to perform .populate("focus")
const CourseFocus = require('../models/courseFocus.model');
const User = require('../models/users.model');
const Inscription = require('../models/inscriptions.model');
const Email = require('../utils/email');
const { request } = require('express');
const { populate } = require('../models/inscriptions.model');
const { user } = require('firebase-functions/v1/auth');

exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const data = [] // Documentos a retornar
    let reqFocus = req.body.focus || [] // Filtros de focus (en caso de no existir, lista vacía)
    
    const features = new APIFeatures(Course.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const documents = await features.query; // Cursos que cumplen con los filtros de los params del URL

    for(let i = 0; i < documents.length; i++) { // Iteramos sobre cada curso
        let filter = (reqFocus.length == 0)?true:false // Para verificar si cumple con los filtros de focus
        const cFocus = await CourseFocus.find({course: documents[i]._id}, {focus:1}).populate("focus"); // Obtenemos los focus asociados

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

/** 
 * A function that creates a course and sends an email to all the users that are interested in the
 * course.
*/
exports.createCourse = catchAsync(async (req, res, next) => {
    const document = await Course.create(req.body);

    const usersToAlert = await User.find({
        $or: [
            // Query and send mail to users in the area
            {
                postalCode: document.postalCode,
            },
            // Query and send email to users interested in topics
            { topics: { $in: document.topics } },
        ],
        emailAgreement: true,
    });

    try {
        await Email.sendMultipleNewCourseAlert(usersToAlert, document);
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando los correos de notificación.',
                500
            )
        );
    }

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(201).json({
            status: 'success',
            data: document,
        });

    res.status(201).json({
        status: 'success',
        data: {
            document,
        },
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
