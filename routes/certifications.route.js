const express = require('express');
const router = express.Router();

const {
    getAllCertifications,
} = require(`${__dirname}/../controllers/certifications.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

//router.use(protect);
router.route('/').get(getAllCertifications);

module.exports = router;