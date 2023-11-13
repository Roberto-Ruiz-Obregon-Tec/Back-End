
const express = require('express');
const router = express.Router();

const {
    getScholarships,
    createScholarship,
} = require(`${__dirname}/../controllers/scholarships.controller.js`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`);

//router.use(protect);
router.route('/').get(protect, restrictTo('Consultar becas'), getScholarships);

router.use(protect, restrictTo('Crear becas'));
router.route('/create').post(createScholarship);

module.exports = router;
