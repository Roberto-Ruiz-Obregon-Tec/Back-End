const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    inscriptionByCourse,
} = require(`${__dirname}/../controllers/course.controller.js`);

const {
    // Inicio de sesión correcto: Bearer token
    protect,
    // RBAC: Verificar que el servicio esté asociado al rol del usuario
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

const fileParser = require('../utils/multipartParser');

router.route('/getInscriptions/:id').get(inscriptionByCourse);

router
    .route('/')
    .get(
        protect, // Validar inicio de sesión
        restrictTo('Consultar cursos'), // Validar servicio asociado al rol
        getAllCourses
    );

router
    .route('/create')
    .post(
        protect, // Validar inicio de sesión
        restrictTo('Crear cursos'), // Validar servicio asociado al rol
        createCourse
    );
    
router
    .route('/:id')
    .get(
        protect, // Validar inicio de sesión
        restrictTo('Consultar cursos'), // Validar servicio asociado al rol
        getCourse
    );

router
    .route('/update/:id')
    .patch(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatCourseImage,
        updateCourse
    );

router
    .route('/delete/:id')
    .delete(
        protect, // Validar inicio de sesión
        restrictTo('Eliminar cursos'), // Validar servicio asociado al rol
        deleteCourse
    );

module.exports = router;
