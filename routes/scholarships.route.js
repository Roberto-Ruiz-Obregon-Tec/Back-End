const express = require('express');

const router = express.Router();

const {
    createScholarship,
    getScholarship,
    getAllScholarships,
    updateScholarship,
    deleteScholarship,
} = require(`${__dirname}/../controllers/scholarship.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

// Esto es asumiendo que quieres proteger algunas rutas para que sólo usuarios autenticados puedan acceder.
router.use(protect);

// Rutas protegidas para roles específicos,para tener roles y restringir el acceso.
// Por ejemplo, restringir la creación, actualización y eliminación de becas a administradores.

router.use(restrictTo('Admin')); 

router.route('/')
    .get(getAllScholarships) // Consultar todas las becas
    .post(createScholarship); // Crear una nueva beca

router.route('/:id')
    .get(getScholarship) // Consultar una beca específica por su ID
    .patch(updateScholarship) // Actualizar una beca específica por su ID
    .delete(deleteScholarship); // Eliminar una beca específica por su ID

module.exports = router;
