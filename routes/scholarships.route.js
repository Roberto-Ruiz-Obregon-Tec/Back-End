
const express = require('express');
const router = express.Router();

const {
    getAllScholarships,
} = require(`${__dirname}/../controllers/scholarships.controller.js`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`);

//router.use(protect);
router.use(protect, restrictTo('Consultar becas'));
router.route('/').get(getAllScholarships);

module.exports = router;
