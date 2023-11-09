const express = require('express');
const router = express.Router();

const { 
    getAllBankAccounts,
    createBankAccount
} = require(`${__dirname}/../controllers/bankAccounts.controller.js`);

const { 
    // Inicio de sesión correcto: Bearer token
    protect, 
    // RBAC: Verificar que el servicio esté asociado al rol del usuario
    restrictTo 
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.use(protect);
router.route('/').get(getAllBankAccounts); //Ruta para consultar las cuentas


router.use(protect, restrictTo("Crear Cuenta de Banco"))
router.route('/create').post(createBankAccount); //Ruta para crear cuentas (restringida)

module.exports = router;



