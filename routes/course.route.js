const express = require('express');

const router = express.Router();

const {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    inscriptionByCourse,
    updateRating,
    getUsers,
    createCourseComment
} = require(`${__dirname}/../controllers/course.controller.js`);

const {
    // Inicio de sesión correcto: Bearer token
    protect,
    // RBAC: Verificar que el servicio esté asociado al rol del usuario
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);



router
    .route('/users/:id')
    .get(
        protect,
        restrictTo('Consultar usuarios inscritos a un curso'),
        getUsers

    )

//Ruta para updatear Rating
router
    .route('/updateRating')
    .put(
        protect,
        restrictTo('Consultar cursos'),
        updateRating
    );

router.route('/getInscriptions/:id').get(inscriptionByCourse);

router
    .route('/') // Ruta raíz
    .get(
        protect, // Validar inicio de sesión
        restrictTo('Consultar cursos'), // Validar servicio asociado al rol
        getAllCourses
    );

router
    .route('/create') // Crear curso
    .post(
        protect, 
        restrictTo('Crear cursos'), 
        createCourse
    );
    
router
    .route('/:id') // Vista detallada de un curso
    .get(
        protect, 
        restrictTo('Consultar cursos'), 
        getCourse
    );

router
    .route('/update') // Editar curso
    .put(
        protect,
        restrictTo('Editar cursos'),
        updateCourse
    );

router
    .route('/delete/:id') // Borrar curso
    .delete(
        protect, 
        restrictTo('Eliminar cursos'), 
        deleteCourse
    );


router
    .route('/comment/create')
    .post(
        protect,
        restrictTo('Crear comentarios'),
        createCourseComment
    )

module.exports = router;
