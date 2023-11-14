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
        status: 'success',
    });
});

exports.createEvent = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe informacion del evento', 404); // Defino un error en caso de que no se mande la informacion
    const {focus, ...eventInfo} = req.body 

    if (eventInfo === undefined) return next(error);

    const newEvent = await Event.create(eventInfo); // Creo el evento

    if (focus !== undefined){ // Si hay focus en el request
        const id = newEvent._id 
        const allFocus = await Focus.find() // Obtengo todos los enfoques de la tabla

        focus.forEach(async (f) => {
            let currentFocus = allFocus.find(jsonFocus => jsonFocus.name == f); // Busco si algun focus ya esta en al base de datos

            if (currentFocus === undefined || currentFocus === null){ // Si no esta
                currentFocus = await Focus.create({name: f}); // Creamos el focus
            }

            const eventFocus = await EventFocus.create({focus: currentFocus._id, event: newEvent._id, }) // Relacionamos el evento con el focus

        });
    }

    res.status(200).json({
        status: 'success',
    });
});

// Filter events by name
exports.getFilteredEvents = async (req, res, next) => {
    try {
        let query = Event.find();

        if (req.query.eventName) {
            const nameRegex = new RegExp(req.query.eventName, 'i');
            query = query.find({ name: nameRegex });
        }

        const features = new APIFeatures(query, req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const events = await features.query;

        res.status(200).json({
            status: 'success',
            results: events.length,
            data: { events} ,
        });
    } catch (err) {
        next(err);
    }
};
