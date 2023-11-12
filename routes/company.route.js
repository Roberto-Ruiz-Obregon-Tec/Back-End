const express = require('express');

const router = express.Router();

const {
    getAllCompanies
} = require(`${__dirname}/../controllers/company.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.route('/').get(
    protect, // Validar inicio de sesión
    restrictTo('Consultar empresas'), // Validar servicio asociado al rol
    getAllCompanies 
);

module.exports = router;
