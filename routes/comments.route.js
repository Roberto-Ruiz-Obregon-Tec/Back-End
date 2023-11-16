const express = require('express');

const router = express.Router();

const {
    deleteComment,
    getAllComments
} = require(`${__dirname}/../controllers/comments.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.route('/delete/:id').delete(protect, restrictTo('Eliminar un comentario'), deleteComment);
router.route('/').get(protect, restrictTo('Consultar comentarios'), getAllComments);



module.exports = router;