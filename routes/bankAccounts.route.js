const express = require('express');
const router = express.Router();

const { 
    getAllBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount
} = require(`${__dirname}/../controllers/bankAccounts.controller.js`);

const { 
    // Inicio de sesión correcto: Bearer token
    protect, 
    // RBAC: Verificar que el servicio esté asociado al rol del usuario
    restrictTo 
} = require(`${__dirname}/../controllers/authentication.controller.js`);



router.route('/').get(protect, getAllBankAccounts); //Ruta para consultar las cuentas

router.route('/create').post(protect, restrictTo("Crear Cuenta de Banco"), createBankAccount); //Ruta para crear cuentas (restringida)

router.route('/update').put(protect, restrictTo("Editar Cuenta de Banco"), updateBankAccount); //Ruta para editar cuentas (restringida)

router.use(protect, restrictTo("Eliminar Cuenta de Banco"))
router.route('/delete').delete(deleteBankAccount); //Ruta para elimnar cuentas (restringida)



module.exports = router;



