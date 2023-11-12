
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Publication = require('../models/publications.model');

exports.createPublication = catchAsync(async (req, res, next) => {
    const error = new AppError('No hay datos para crear la publicación', 404);
    const {...publicationInfo} = req.body;

    if(publicationInfo === undefined) return next(error); // Si no se recibió información, se manda un error

    await Publication.create(publicationInfo); // Se registra en la base de datos

    res.status(200).json({
        status: 'success'
    });
});
