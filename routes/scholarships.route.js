
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


router.use(protect, restrictTo('Crear becas'));
router.route('/create').post(createScholarship);

router.use(protect, restrictTo('Eliminar becas'));
router.route('/delete/:id').delete(deleteScolarship);

router.use(protect, restrictTo('Consultar becas'));
router.route('/').get(getScholarships);

module.exports = router;
