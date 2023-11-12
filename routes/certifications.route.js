const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/scholarship.controller');

const {
    getAllCertifications,
} = require(`${__dirname}/../controllers/certifications.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.route('/').get(
    protect, // Validar inicio de sesión
    restrictTo('Consultar certificaciones'), // Validar servicio asociado al rol
    getAllCertifications
    );

module.exports = router;