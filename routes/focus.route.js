const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    getFocus,
    deleteFocus
} = require(`${__dirname}/../controllers/focus.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.route('/').get(protect, restrictTo('Consultar enfoques'), getFocus);

router.route('/delete/:id').delete(protect, restrictTo('Eliminar enfoques'), deleteFocus);

module.exports = router