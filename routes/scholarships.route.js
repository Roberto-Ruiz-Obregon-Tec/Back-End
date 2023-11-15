const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarships.controller');
const { protect, restrictTo } = require('../controllers/authentication.controller');

const {
    getAllScholarship,
    getScholarship,
    createScholarship,
    updateScholarship,
    deleteScholarship,
} = scholarshipController;

router.route('/')
    .get(
        protect, 
        restrictTo('Consultar becas'),
        getAllScholarship
    )
    .post(
        protect,
        restrictTo('Crear becas'), 
        createScholarship
    );

    router.route('/:id')
    .get(
        protect,
        restrictTo('Consultar becas'),
        getScholarship
    )
    .patch(
        protect,
        restrictTo('Editar becas'), 
        updateScholarship
    )
    .delete(
        protect, 
        restrictTo('Eliminar becas'), 
        deleteScholarship
    );


module.exports = router;
