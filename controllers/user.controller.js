const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const User = require('../models/users.model');
const UserRol = require('../models/userRol.model');
const UserFocus = require('../models/userFocus.model');
const Focus = require('../models/focus.model');
const Rol = require('../models/rols.model'); 
const crypto = require('crypto');

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
