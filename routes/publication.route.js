
const express = require('express');
const router = express.Router();

// Importar controladores necesarios
const {
    createPublication,
}  = require(`${__dirname}/../controllers/publication.controller`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`);

// Crear publicaciones
router.use(protect, restrictTo('Crear una publicación'));
router.route('/create').post(createPublication);

module.exports = router; // Se exporta el router con las rutas definidas
