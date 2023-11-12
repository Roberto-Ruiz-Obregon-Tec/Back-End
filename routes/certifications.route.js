const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certifications.controller');
const { protect, restrictTo,} = require(`${__dirname}/../controllers/authentication.controller.js`);

const {
    getAllCertifications,
    createCertification,
    deleteCertification,
} = certificationController;


router.route('/').get(
    protect, // Validar inicio de sesión
    restrictTo('Consultar certificaciones'), // Validar servicio asociado al rol
    getAllCertifications
    );

router.route('/').post(
    protect, // Validar inicio de sesión
    restrictTo('Crear certificaciones'), // Validar servicio asociado al rol
    createCertification
);
router.route('/:id')
    .delete(
        protect, // Validar inicio de sesión
        restrictTo('Eliminar certificaciones'), // Validar servicio asociado al rol
        deleteCertification
    );

module.exports = router;