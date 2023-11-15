const express = require('express');

const router = express.Router();

const {
    deleteComment,
    updateCommentStatus
} = require(`${__dirname}/../controllers/comments.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.use(protect, restrictTo('Eliminar un comentario'));
router.route('/delete/:id').delete(deleteComment);

router.route('/update-status').post(protect, restrictTo('Aprobar comentarios'), updateCommentStatus);

module.exports = router;