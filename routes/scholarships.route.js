const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarship.controller');
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
        restrictTo('Admin'), 
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
        restrictTo('Admin'), 
        updateScholarship
    )
    .delete(
        protect, 
        restrictTo('Admin'), 
        deleteScholarship
    );


module.exports = router;
