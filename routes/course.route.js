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
    updateRating
} = require(`${__dirname}/../controllers/course.controller.js`);

const {
    // Inicio de sesión correcto: Bearer token
    protect,
    // RBAC: Verificar que el servicio esté asociado al rol del usuario
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

const fileParser = require('../utils/multipartParser');

//Ruta para updatear Rating
router
    .route('/updateRating')
    .put(
        protect,
        restrictTo('Consultar cursos'),
        updateRating
    )

router.route('/getInscriptions/:id').get(inscriptionByCourse);

router
    .route('/')
    .get(
        protect, // Validar inicio de sesión
        restrictTo('Consultar cursos'), // Validar servicio asociado al rol
        getAllCourses
    )
    .post(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatCourseImage,
        createCourse
    );
    
router
    .route('/:id')
    .get(
        protect, // Validar inicio de sesión
        restrictTo('Consultar cursos'), // Validar servicio asociado al rol
        getCourse
    )
    .patch(
        protect,
        restrictTo('Admin'),
        fileParser,
        filesController.formatCourseImage,
        updateCourse
    )
    .delete(
        protect, // Validar inicio de sesión
        restrictTo('Eliminar cursos'), // Validar servicio asociado al rol
        deleteCourse
    );

module.exports = router;
