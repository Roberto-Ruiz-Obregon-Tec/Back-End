
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Publication = require('../models/publications.model');

exports.updatePublication = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe una publicación con ese ID', 404);
    const {_id, ...publicationInfo} = req.body;

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
