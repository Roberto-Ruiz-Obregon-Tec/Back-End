const express = require('express');
const router = express.Router();

const {
    getAllCertifications,
} = (`${__dirname}/../controllers/certifications.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.use(protect);
router.route('/certifications').get(restrictTo('User'), getAllCertifications);

module.exports = router;