const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    getFocus
} = require(`${__dirname}/../controllers/focus.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.route('/').get(protect, restrictTo('Consultar enfoques'), getFocus);


module.exports = router