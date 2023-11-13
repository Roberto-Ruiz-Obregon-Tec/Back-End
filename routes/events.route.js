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

router.use(protect, restrictTo('Crear eventos'));
router.route('/create')
    .post(
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

router.use(protect, restrictTo('Editar eventos'))
router.route('/update')
    .put(
        fileParser,
        filesController.formatEventImage,
        updateEvent
    );

// Delete event
router.use(protect, restrictTo('Eliminar eventos'))
router.route('/delete/:id').delete(deleteEvent);

module.exports = router;
