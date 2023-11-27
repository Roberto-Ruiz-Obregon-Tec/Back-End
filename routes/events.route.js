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
    );

router.route('/create')
    .post(
        protect,
        restrictTo('Crear eventos'),
        fileParser,
        filesController.formatEventImage,
        createEvent
    );

router 
.route('/:id')
    .get(protect,
        restrictTo('Consultar eventos'), // Validar servicio asociado al rol
        getEvent
    );

router.route('/update')
    .put(
        protect, 
        restrictTo('Editar eventos'),
        fileParser,
        filesController.formatEventImage,
        updateEvent
    );

// Delete event
router.route('/delete/:id').delete(protect, restrictTo('Eliminar eventos'), deleteEvent);

module.exports = router;
