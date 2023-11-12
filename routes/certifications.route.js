const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certifications.controller');
const { protect, restrictTo,} = require(`${__dirname}/../controllers/authentication.controller.js`);

const {
    getAllCertifications,
} = certificationController;


router.route('/').get(
    protect, // Validar inicio de sesión
    restrictTo('Consultar certificaciones'), // Validar servicio asociado al rol
    getAllCertifications
    );

module.exports = router;