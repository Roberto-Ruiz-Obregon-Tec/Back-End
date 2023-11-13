
const express = require('express');
const router = express.Router();

const {
    getScholarships,
    createScholarship,
    deleteScolarship
} = require(`${__dirname}/../controllers/scholarships.controller.js`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.route('/create').post(protect, restrictTo('Crear becas'), createScholarship);

router.route('/delete/:id').delete(protect, restrictTo('Eliminar becas'), deleteScolarship);

router.route('/').get(protect, restrictTo('Consultar becas'), getScholarships);

module.exports = router;
