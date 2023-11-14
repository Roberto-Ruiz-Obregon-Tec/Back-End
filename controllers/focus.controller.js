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
