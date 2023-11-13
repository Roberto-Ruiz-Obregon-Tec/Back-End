const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Focus = require('../models/focus.model');
const APIFeatures = require(`../utils/apiFeatures`);


exports.getFocus = catchAsync(async (req, res, next) => {
    const focus = await Focus.find()

    res.status(200).json({
        status: 'success',
        results: focus.length,
        data: {
            focus,
        },
    });
});

exports.updateFocus = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe un enfoque con ese ID', 404);
    const {_id, name} = req.body;

    if(!mongoose.isValidObjectId(_id)) return next(error);

    const prevFocus = await Focus.findOne({"_id": _id}); // Si no se encuentra el enfoque
    if(!prevFocus) return next(error); // Se retorna un mensaje de error

    if(name) { // En caso de haber recibido un nombre
        prevFocus.name = name; // Se actualiza
        prevFocus.save(); // Se guardan los cambios
    }

    res.status(200).json({
        status: 'success'
    });
});
