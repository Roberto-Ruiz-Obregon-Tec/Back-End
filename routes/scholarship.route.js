const express = require('express');
const scholarshipController = require('../controllers/scholarship.controller');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authentication.controller');

const {
    getAllScholarship,
    getScholarship,
    createScholarship,
    updateScholarship,
    deleteScholarship,
    getContactInfo,
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

router.route('/:id/contact')
    .get(
        protect,
        restrictTo('Consultar becas'),
        getContactInfo
    );

module.exports = router;
