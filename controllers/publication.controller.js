
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')
const Publication = require('../models/publications.model');
const CommentPublication = require('../models/commentPublication.model')
const Comment = require('../models/comments.model')
const APIFeatures = require(`../utils/apiFeatures`);

exports.getAllPublications = catchAsync(async (req, res, next) => {
    const publicationFeatures = new APIFeatures(Publication.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const publications = await publicationFeatures.query;
    const publicationsComments = await CommentPublication.find().populate('comment');

    // Iterar por las publicaciones para concatenar los comentarios asociados a cada una 
    for (let i = 0; i < publications.length; i++) {
        const commentList = [];
 
        // Proceso para asociar los comentarios que estan asociados a la publicacion actual

        const mapComments = publicationsComments.map(pc => {
            if (publications[i]._id.toString() === pc.publication.toString() && pc.comment.status === 'Aprobado') {
                commentList.push(pc.comment.comment);
            }
        })

       publications[i] = {...publications[i]._doc, "comments" : commentList}
    }

    // Send the filtered user data as a response
    res.status(200).json({
        status: 'success',
        results: publications.length,
        data: {
            publications,
        },
    });
})


exports.createPublication = catchAsync(async (req, res, next) => {
    const error = new AppError('No hay datos para crear la publicación', 404);
    const {...publicationInfo} = req.body;

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
