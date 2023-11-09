const factory = require('./handlerFactory.controller');
const Event = require('../models/events.model');
const EventFocus = require('../models/eventFocus.model');
const Focus = require('../models/focus.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')

exports.getAllEvents = factory.getAll(Event);
exports.getEvent = factory.getOne(Event);
exports.updateEvent = factory.updateOne(Event);

exports.deleteEvent = catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del evento a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del evento a eliminar

    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en los params mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError);

    await EventFocus.deleteMany({event: id}); // Eliminamos los registros de los enfoques asociados al evento
    await Event.deleteOne({_id : id}); // Eliminamos el evento

    res.status(200).json({
        status: 'success'
    });
});