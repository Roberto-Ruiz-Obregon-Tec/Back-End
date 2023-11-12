const express = require('express');
const router = express.Router();

// Importar controladores necesarios
const {
    deletePublication
}  = require(`${__dirname}/../controllers/publication.controller`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.use(protect, restrictTo('Borrar una publicación'));
router.route('/delete/:id').delete(deletePublication);

module.exports = router;