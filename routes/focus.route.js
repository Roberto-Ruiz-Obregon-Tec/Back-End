const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    getFocus,
    updateFocus
} = require(`${__dirname}/../controllers/focus.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.route('/').get(protect, restrictTo('Consultar enfoques'), getFocus);

router.route('/update').put(protect, restrictTo('Editar enfoques'), updateFocus);

module.exports = router