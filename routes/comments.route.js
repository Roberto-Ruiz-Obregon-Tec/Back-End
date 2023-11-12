const express = require('express');

const router = express.Router();

const {
    deleteComment,
} = require(`${__dirname}/../controllers/comments.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.use(protect, restrictTo('Eliminar un comentario'));
router.route('/delete/:id').delete(deleteComment);

module.exports = router;