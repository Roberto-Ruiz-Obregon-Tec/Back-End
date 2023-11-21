const express = require('express');

const router = express.Router();

const {
    getAllCompanies,
    createCompany,
    deleteCompany,
    updateCompany,
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

router.route('/create').post(protect, restrictTo('Editar catálogo de empresas ESR'), createCompany);

router.route('/delete/:id').delete(protect, restrictTo('Dar de baja empresas del catálogo ESR'), deleteCompany);

router.route('/update').put(protect, restrictTo('Editar catálogo de empresas ESR'), updateCompany);

module.exports = router;
