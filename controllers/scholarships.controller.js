// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const mongoose = require('mongoose');
const scholarships = require('../models/scholarships.model');
const factory = require('./handlerFactory.controller');
const Focus = require('../models/focus.model')
const ScholarshipFocus = require('../models/scholarshipFocus.model')

exports.getScholarships = catchAsync(async (req, res, next) => {
    const data = [] // Documentos a retornar
    let reqFocus = req.body.focus || [] // Filtros de focus (en caso de no existir, lista vacía)
    
    const features = new APIFeatures(scholarships.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const documents = await features.query; // Becas que cumplen con los filtros de los params del URL

    const scholarshipFocus = await ScholarshipFocus.find().populate("focus"); // Registros de los focus asociados a las becas

    for(let i = 0; i < documents.length; i++) { // Iteramos sobre cada beca
        // Focus asociados
        let filter = (reqFocus.length == 0)?true:false // Para verificar si cumple con los filtros de focus
        const sFocus = scholarshipFocus.filter(focusInfo => focusInfo.scholarship.toString() == documents[i]._id.toString()); // Obtenemos los focus asociados
        
        let focus = []
        if(sFocus.length > 0) { // Si existen focus asociados entonces...
            sFocus.forEach( f => { 
                focus.push(f.focus.name) // Almacenamos el nombre
                filter = (reqFocus.includes(f.focus.name))?true:filter // Seguimos verificando si hay coincidencias de filtros
            })
        }

        if(filter) data.push({...documents[i]._doc, "focus": focus}) // Si coincide con algún focus solicitado se almacena
    }

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: {"documents": data},
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