const express = require('express');

const router = express.Router();

const {
    getAllCompanies
} = require(`${__dirname}/../controllers/companyCertifications.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

// router.use(protect);
router.route('/').get(getAllCompanies);

module.exports = router;
