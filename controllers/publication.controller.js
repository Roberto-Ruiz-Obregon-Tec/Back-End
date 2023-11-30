
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Publication = require('../models/publications.model');
const CommentPublication = require('../models/commentPublication.model');
const UserPublication = require('../models/userPublication.model');
const Comment = require('../models/comments.model');
const APIFeatures = require(`../utils/apiFeatures`);

function compareByDate(a, b) {
    if (a.createdAt > b.createdAt) {
        return -1;
    }
    if (b.createdAt > a.createdAt) {
        return 1;
    }
    return 0;
}

exports.getAllPublications = catchAsync(async (req, res, next) => {
    const publicationFeatures = new APIFeatures(Publication.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const publications = await publicationFeatures.query;
    const publicationsComments = await CommentPublication.find().populate("comment").populate([
        { 
          path: 'comment', 
          populate: [{ path: 'user' }] 
        }
      ]);

    const user = req.client.id

    const userPublications = await UserPublication.find().populate('user')

    // Iterar por las publicaciones para concatenar los comentarios asociados a cada una 
    for (let i = 0; i < publications.length; i++) {
        const commentList = [];
        // Proceso para asociar los comentarios que estan asociados a la publicacion actual

        const mapComments = publicationsComments.map(pc => {
            if (publications[i]._id.toString() === pc.publication.toString() && pc.comment.status === 'Aprobado') {
                commentList.push({"comment" : pc.comment.comment, "user": pc.comment.user.firstName + " " + pc.comment.user.lastName, "createdAt" :  pc.comment.createdAt});
            }
        })
        
       const sortedCommentList = commentList.sort(compareByDate)
       publications[i] = {...publications[i]._doc, "comments" : sortedCommentList}

        if (userPublications.length > 0 ){
            const flag = userPublications.find(up => up.user._id.toString() === user.toString() && publications[i]._id.toString() == up.publication.toString());

            if (flag !== undefined && flag != null) {
                publications[i] = {...publications[i], "liked" : true}
            } else {
                publications[i] = {...publications[i], "liked" : false}
            }
        } else {
            publications[i] = {...publications[i], "liked" : false}
            }
            
        
        }

    // Send the filtered user data as a response
    res.status(200).json({
        status: 'success',
        results: publications.length,
        data: publications,
    });
})

exports.getPublication = catchAsync(async (req, res, next) => {
    const error = new AppError('No hay una publicación asociada a ese id', 404);
    if(!mongoose.isValidObjectId(req.params.id)) return next(error); // Mandamos un error si no es un id válido

    const publicationFeatures = new APIFeatures(Publication.find({ _id: req.params.id }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const publication = await publicationFeatures.query;
    if(!publication) return next(error); // Mandamos un error si no hay una publicación asociada

    const publicationsComments = await CommentPublication.find({publication: publication[0]._id}, {comment:1}).populate('comment').populate([
        { 
          path: 'comment', 
          populate: [{ path: 'user' }] 
        }
    ]);

    let commentList = [];

    // Proceso para asociar los comentarios que estan asociados a la publicacion actual
    publicationsComments.forEach( p => {
        if(p.comment.status == 'Aprobado') {
            commentList.push({"comment": p.comment.comment, "user": p.comment.user.firstName + " " + p.comment.user.lastName});
        }
    });

    publication[0] = {...publication[0]._doc, "comments": commentList}; // Guardamos los comentarios que han sido aprobados

    const user = req.client.id

    const userPublications = await UserPublication.find().populate('user')

    if (userPublications.length > 0 ){
        const flag = userPublications.find(up => up.user._id.toString() === user.toString() && publication[0]._id.toString() == up.publication.toString());

        if (flag !== undefined && flag != null) {
            publication[0] = {...publication[0], "liked" : true}
        } else {
            publication[0] = {...publication[0], "liked" : false}
        }
    } else {
        publication[0] = {...publication[0], "liked" : false}
        }

    // Send the filtered user data as a response
    res.status(200).json({
        status: 'success',
        results: publication.length,
        data: publication,
    });
})

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


exports.createPublicationComment = catchAsync(async (req, res, next) => {
    const missingError = new AppError('Falta el comentario o la id de la publicacion', 404); // Defino un error en caso de que no se mande el id de la publicacion a eliminar

    const user = req.client._id;
    const {comment, publication} = req.body

    if (comment === undefined || comment === null) return next(missingError)
    if (publication === undefined || publication === null) return next(missingError)

    const created_comment = await Comment.create({comment : comment, status : "Pendiente", user: user}); // Crear el comentario
    const publicationComment = await CommentPublication.create({publication: publication, comment: created_comment._id}) // Ligar el comentario a la publicacion


    res.status(200).json({
        status: 'success'
    });
})

exports.likePublication = catchAsync(async (req, res, next) => {
    const user = req.client.id
    const publication = req.body.publication

    const userPublications = await UserPublication.find().populate('publication').populate('user');

    // Checar si el usuario ya tenia la publicacion como "likeada"
    const flag = userPublications.find(up => up.user._id.toString() === user.toString() && up.publication._id == publication);

    const toUpdatePublication = await Publication.findOne({_id : publication})

    if (flag === undefined || flag === null) { 
        await UserPublication.create({user: user, publication : publication}) // Agregarla a publicaciones likeadas
        await Publication.findOneAndUpdate({_id : publication}, {likes : toUpdatePublication.likes + 1})
    } else { // Borrarla de publicaciones likeadas
        await UserPublication.deleteOne({ 
            $and: [
                {user : user},
                {publication : publication}
            ]
        })
        await Publication.findOneAndUpdate({_id : publication}, {likes : toUpdatePublication.likes - 1})
    }

    res.status(200).json({
        status: 'success'
    });

})