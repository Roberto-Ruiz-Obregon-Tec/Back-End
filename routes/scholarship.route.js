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
    .get(getAllScholarship)
    .post(createScholarship);

    router.route('/:id')
    .get(getScholarship)
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
    .get(getContactInfo);

module.exports = router;
