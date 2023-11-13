
const express = require('express');
const router = express.Router();

// Importar controladores necesarios
const {
    getAllPublications,
    createPublication,
    deletePublication
}  = require(`${__dirname}/../controllers/publication.controller`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`)

// Crear publicaciones
router.route('/create').post(protect, restrictTo('Crear una publicación'), createPublication);

//Borrar publicaciones
router.route('/delete/:id').delete(protect, restrictTo('Borrar una publicación'), deletePublication);


router.route('/').get(protect, restrictTo('Consultar publicaciones'), getAllPublications);

module.exports = router; // Se exporta el router con las rutas definidas
