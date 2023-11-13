const factory = require('./handlerFactory.controller');
const Courses = require('../models/courses.model');
const CommentCourse = require('../models/commentCourse.model');
const Publications = require('../models/publications.model');
const CommentPublication = require('../models/commentPublication.model');
const Comments = require('../models/comments.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')

exports.deleteComment = catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del comentario a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del comentario a eliminar

    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en los params mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError);

    await CommentCourse.deleteMany({comment: id}); // Eliminamos los registros de los comentarios asociados al curso
    await CommentPublication.deleteMany({comment: id}); // Eliminamos los registros de los comentarios asociados a la publicacion
    await Comments.deleteOne({_id : id}); // Eliminamos el comentario

    res.status(200).json({
        status: 'success',
    });
});