
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Publication = require('../models/publications.model');
const CommentPublication = require('../models/commentPublication.model');
const Comment = require('../models/comments.model');

exports.updatePublication = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe una publicación con ese ID', 404);
    const {_id, likes, ...publicationInfo} = req.body; // Aislamos los likes para que no puedan editarse

    if(!mongoose.isValidObjectId(_id)) return next(error);

    const prevPublication = await Publication.findOne({"_id": _id}); // Si no se encuentra la publicación
    if(!prevPublication) return next(error); // Se retorna un mensaje de error

    const keys = Object.keys(prevPublication._doc);

    for(key of keys){ // Iteramos sobre las llaves del objeto
        prevPublication[key] = publicationInfo[key] || prevPublication[key]; // Se actualizan los atributos recibidos
    }

    await prevPublication.save(); // Se guardan los cambios

    res.status(200).json({
        status: 'success'
    });
});


exports.createPublication = catchAsync(async (req, res, next) => {
    const error = new AppError('No hay datos para crear la publicación', 404);
    const {likes, ...publicationInfo} = req.body; // Aislamos los likes para que la publicación inicie con 0

    if(publicationInfo === undefined) return next(error); // Si no se recibió información, se manda un error

    await Publication.create(publicationInfo); // Se registra en la base de datos

    res.status(200).json({
        status: 'success'
    });
});

exports.deletePublication = catchAsync( async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id de la publicacion a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id de la publicacion a eliminar

    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en el body mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError); // Si el id no es valido, mandamos error

    // Borramos la publicacion
    await Publication.deleteOne({_id: id});
    
    // Borramos los comentarios asociados a la publicacion
    const comments_id = await CommentPublication.find({publication: id}, {comment: 1, _id : 0});

    // Borramos los comentarios asociados a la publicacion
    await CommentPublication.deleteMany({publication : id});
    
    // Borramos los comentarios
   comments_id.forEach(async (c) => {
        await Comment.deleteOne({_id : c.comment})
   });

    res.status(200).json({
        status: 'success'
    });
});
