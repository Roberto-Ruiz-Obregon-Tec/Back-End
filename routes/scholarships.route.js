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
router.route('/').get(protect, restrictTo('Consultar becas'), getScholarships);

module.exports = router;