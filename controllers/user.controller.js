const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const User = require('../models/users.model');
const UserRol = require('../models/userRol.model');
const UserFocus = require('../models/userFocus.model');
const Focus = require('../models/focus.model'); // Reference to the Focus model
const Rol = require('../models/rols.model'); // Reference to the Rol model
const UserCourse = require('../models/userCourse.model');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const Course = require('../models/courses.model');
const CourseFocus = require('../models/courseFocus.model');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, ['topics']);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const userFeatures = new APIFeatures(User.find({}, { password: 0 }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = await userFeatures.query;

    const req_rol = req.body.rol || ""; // Filtro por rol
    const req_focus = req.body.focus || []; // Filtro por enfoque


    const userRols = await UserRol.find().populate('rol'); // Acceder a las asociaciones de usuario y rol
    const userFocus = await UserFocus.find().populate('focus'); // Acceder a las asociaciones de usuario y enfoque


    for (let i = users.length - 1; i >= 0; i--) {
        const focusList = [];
        
        let focusFilter = (req_focus.length == 0) ? true : false;

        // Encontramos el rol del usuario
        const rol = userRols.find(userInfo => userInfo.user.toString() == users[i]._id.toString());

        if (rol === undefined || rol === null) { // Si no hay rol
            users[i] = { ...users[i]._doc, "rol": "Sin rol asignado" };
        } else { // Agregamos el rol
            users[i] = { ...users[i]._doc, "rol": rol.rol.name };
        }

        
        const mapFocus = userFocus.map(f => {
            if (f.user.toString() === users[i]._id.toString()) { // Agregamos el enfoque al usuario
                focusList.push(f.focus.name);
                focusFilter = req_focus.includes(f.focus.name) ? true : focusFilter;
            }
        });

        users[i] = { ...users[i], "focus": focusList }; // Agregamos la lsita de intereses

        if ((req_rol !== "" && users[i].rol != req_rol) || !focusFilter) {
            users.splice(i, 1); // Removemos al usuario en caso de no cumplir los filtros
        }
    }

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

exports.getMyCourses = catchAsync(async (req, res, next) => {
    // Create an instance of APIFeatures for filtering, sorting, limiting, and pagination
    const token = req.cookies.jwt;

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        
        if (err) {
            res.status(500).json({
                status: 'error: An error occured decoding user (JWT):'
            });
        }
        
        else {
            const userCoursesFeatures = new APIFeatures(UserCourse.find({},{},{user: user.id}), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

            const userCourses = await userCoursesFeatures.query;
            
            courses = []

            for(let i = 0; i < userCourses.length; i++) {
                courseID = userCourses[i].toObject().course
                
                const features = new APIFeatures(Course.findOne({ _id: courseID}), req.query)
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
                
                courses.push(document[0])
            }

            res.status(200).json({
                status: 'success',
                data: courses,
            });
        };
    });
});