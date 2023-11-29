const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Focus = require('../models/focus.model');
const CompanyFocus = require('../models/companyFocus.model');
const CourseFocus = require('../models/courseFocus.model');
const EventFocus = require('../models/eventFocus.model');
const ProgramFocus = require('../models/programFocus.model');
const UserFocus = require('../models/userFocus.model');
const ScholarshipFocus = require('../models/scholarshipFocus.model');
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
        await prevFocus.save(); // Se guardan los cambios
    }

    res.status(200).json({
        status: 'success'
    });
});

exports.deleteFocus = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe un enfoque con ese ID', 404);

    if(!mongoose.isValidObjectId(req.params.id)) return next(error);

    // Borrar relaciones con usuario
    await UserFocus.deleteMany({focus: req.params.id});

    // Borrar relaciones con becas
    await ScholarshipFocus.deleteMany({focus: req.params.id});

    // Borrar relaciones con programa
    await ProgramFocus.deleteMany({focus: req.params.id});

    // Borrar relaciones con eventos
    await EventFocus.deleteMany({focus: req.params.id});

    // Borrar relaciones con cursos
    await CourseFocus.deleteMany({focus: req.params.id});

    // Borrar relaciones con empresas
    await CompanyFocus.deleteMany({focus: req.params.id});

    // Borrar focus
    const doc = await Focus.findByIdAndDelete(req.params.id);

    if (!doc) return next(error);

    res.status(200).json({
        status: 'success'
    });
});
