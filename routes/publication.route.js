
const express = require('express');
const router = express.Router();

// Importar controladores necesarios
const {
    getAllPublications,
    getPublication,
    updatePublication,
    createPublication,
    deletePublication,
    createPublicationComment,
    likePublication
}  = require(`${__dirname}/../controllers/publication.controller`);

const {
    protect, // Inicio de sesión correcto: Bearer token
    restrictTo, // RBAC: Verificar que el servicio esté asociado al rol del usuario
} = require(`${__dirname}/../controllers/authentication.controller.js`)

// Editar publicaciones
router.route('/update').put(protect, restrictTo('Editar una publicación'), updatePublication);
// Crear publicaciones
router.route('/create').post(protect, restrictTo('Crear una publicación'), createPublication);

//Borrar publicaciones
router.route('/delete/:id').delete(protect, restrictTo('Borrar una publicación'), deletePublication);

router.route('/comment/create').post(protect, restrictTo('Crear comentarios'), createPublicationComment);

router.route('/like').post(protect, restrictTo('Dar me gusta'), likePublication);

router.route('/').get(protect, restrictTo('Consultar publicaciones'), getAllPublications);
router.route('/:id').get(protect, restrictTo('Consultar publicaciones'), getPublication);

module.exports = router; // Se exporta el router con las rutas definidas
