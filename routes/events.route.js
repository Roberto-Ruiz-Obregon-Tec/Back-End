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
    .get(getAllEvents)
    // .post(
    //     protect,
    //     restrictTo('Admin'),
    //     fileParser,
    //     filesController.formatEventImage,
    //     createEvent
    // );

router
    .route('/:id')
    .get(getEvent)
    .patch(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatEventImage,
        updateEvent
    );

// Delete event
router.use(protect, restrictTo('Eliminar eventos'), )
router.route('/delete/:id').delete(deleteEvent);

module.exports = router;
