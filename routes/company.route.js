const express = require('express');

const router = express.Router();

const {
    getAllCompanies,
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

router.use(protect, restrictTo('Dar de baja empresas del catálogo ESR'));
router.route('/delete/:id').delete(deleteCompany);

router.use(protect, restrictTo('Editar catálogo de empresas ESR'));
router.route('/update').put(updateCompany);

module.exports = router;
