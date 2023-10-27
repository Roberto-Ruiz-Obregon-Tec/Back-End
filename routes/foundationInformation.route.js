const express = require('express');
const foundationInformationController = require('../controllers/foundationInformation.controller.js');
const { protect, restrictTo } = require('../controllers/authentication.controller.js');

const router = express.Router();

router
    .route('/')
    .get(foundationInformationController.getAllfoundationInformation)
    .post(protect, restrictTo('Admin'), foundationInformationController.createfoundationInformation);

router
    .route('/:id')
    .get(foundationInformationController.getfoundationInformation)
    .patch(protect, restrictTo('Admin'), foundationInformationController.updatefoundationInformation)
    .delete(protect, restrictTo('Admin'), foundationInformationController.deletefoundationInformation);

module.exports = router;
