const express = require('express');

const router = express.Router();

const {
    getScholarships,
} = require(`${__dirname}/../controllers/scholarships.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

//router.use(protect);
router.use(protect, restrictTo('Consultar becas'));
router.route('/').get(getScholarships);

module.exports = router;