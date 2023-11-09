const express = require('express');
const router = express.Router();

const { 
    createBankAccount 
} = require(`${__dirname}/../controllers/bankAccounts.controller.js`);

const { 
    protect, 
    restrictTo 
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.use(protect);

//router.route('/').get(getAllfoundationInformation);
router.use(protect, restrictTo("Crear Cuenta de Banco"))
router.route('/create').post(createBankAccount);

module.exports = router;



