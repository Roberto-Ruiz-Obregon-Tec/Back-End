const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')
const Publication = require('../models/publications.model');
const CommentPublication = require('../models/commentPublication.model')
const Comment = require('../models/comments.model')

exports.deletePublication = catchAsync( async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del programa a eliminar

    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del programa a eliminar


    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en el body mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError); // Si el id no es valido, mandamos error

    // Borramos los enfoques asociados al programa y el programa
   // await Publication.deleteOne({_id: id});
    
    const comments_id = await CommentPublication.find({publication: id}, {comment: 1});
    console.log(comments_id)

   // await CommentPublication.deleteMany({publication : id});


    res.status(200).json({
        status: 'success'
    });

})