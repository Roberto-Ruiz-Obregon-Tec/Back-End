// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const mongoose = require('mongoose');
const Focus = require('../models/focus.model');
const scholarships = require('../models/scholarships.model');
const ScholarshipFocus = require('../models/scholarshipFocus.model');
const mongoose = require('mongoose')

// read scholarships
exports.getScholarships = catchAsync(async (req, res, next) => {
    let filter = {};
    let query = scholarships.find(filter).select('name sector description organization');
    
    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .paginate();
    
    const becas = await features.query;

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(200).json({
            status: 'success',
            results: becas.length,
            data: becas,
        });

    res.status(200).json({
        status: 'success',
        results: becas.length,
        data: { becas },
    });
});

exports.createScholarship = catchAsync(async (req, res, next) => {
    const error = new AppError('No hay datos para crear la beca', 404);
    const {focus, ...scholarshipInfo} = req.body;

    if(scholarshipInfo === undefined) return next(error); // En caso de no recibir datos para crear una beca, manda un error

    const newScholarship = await scholarships.create(scholarshipInfo);
    
    if(focus) { 
        const focusRecords = await Focus.find(); // Obtenemos los focus ya registrados

        for(const focusName of focus) { // Para cada focus asociado a la beca
            let match = focusRecords.find(record => record.name == focusName); // Verificamos si está registrado

            if(!match) { // Si no existe, se crea
                match = await Focus.create({
                    "name": focusName
                });
            }

            await ScholarshipFocus.create({ // Se crea la relación
                "scholarship": newScholarship._id,
                "focus": match._id
            });
        }
    }

    res.status(200).json({
        status: 'success'
    });
});

exports.updateScholarship = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe una beca con ese ID', 404);
    const {_id, focus, ...scholarshiṕInfo} = req.body;

    if(!mongoose.isValidObjectId(_id)) return next(error);

    const prevScholarship = await scholarships.findOne({"_id": _id}); // Si no se encuentra la beca
    if(!prevScholarship) return next(error); // Se retorna un mensaje de error

    const keys = Object.keys(prevScholarship._doc);

    for(key of keys){ // Iteramos sobre las llaves del objeto
        prevScholarship[key] = scholarshiṕInfo[key] || prevScholarship[key]; // Se actualizan los atributos recibidos
    }

    await prevScholarship.save(); // Se guardan los cambios
    
    if(focus) { // Si hay cambios en los focus
        await ScholarshipFocus.deleteMany({scholarship: _id}); // Borramos las relaciones existentes

        const focusRecords = await Focus.find(); // Obtenemos los focus ya registrados

        for(const focusName of focus) { // Para cada focus del update
            let match = focusRecords.find(record => record.name == focusName); // Verificamos si está registrado

            if(!match) { // Si no existe, se crea
                match = await Focus.create({
                    "name": focusName
                });
            }

            await ScholarshipFocus.create({ // Se crea la relación
                "scholarship": _id,
                "focus": match._id
            });
        }
    }

    res.status(200).json({
        status: 'success'
    });
});

exports.deleteScolarship = catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id de la beca a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id de la beca a eliminar


    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en los params mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError); // Si el id no es valido, mandamos error

    // Borramos los enfoques asociados al programa y el programa
    await ScholarshipFocus.deleteMany({scholarship: id});
    await scholarships.deleteOne({_id : id});

    res.status(200).json({
        status: 'success'
    });
});
