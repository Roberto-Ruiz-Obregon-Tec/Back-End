const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} = require(`${__dirname}/../controllers/event.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);
const fileParser = require('../utils/multipartParser');

router
    .route('/')
    .get(
        protect,
        restrictTo('Consultar eventos'), // Validar servicio asociado al rol
        getAllEvents
        )
    .post(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatEventImage,
        createEvent
    );
router 
    .route('/:id')
    .get(protect,
        restrictTo('Consultar eventos'), // Validar servicio asociado al rol
        getEvent
        )
    .patch(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatEventImage,
        updateEvent
    )
    .delete(protect, restrictTo('Admin'), deleteEvent);

module.exports = router;
