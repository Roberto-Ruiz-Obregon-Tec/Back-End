const express = require('express');
const informacionFundacionController = require('../controllers/informacionFundacion.controller.js');
const { protect, restrictTo } = require('../controllers/authentication.controller.js');

const router = express.Router();

router
    .route('/')
    .get(informacionFundacionController.getAllInformacionFundacion)
    .post(protect, restrictTo('Admin'), informacionFundacionController.createInformacionFundacion);

router
    .route('/:id')
    .get(informacionFundacionController.getInformacionFundacion)
    .patch(protect, restrictTo('Admin'), informacionFundacionController.updateInformacionFundacion)
    .delete(protect, restrictTo('Admin'), informacionFundacionController.deleteInformacionFundacion);

module.exports = router;
