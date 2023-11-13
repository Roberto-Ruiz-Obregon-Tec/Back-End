// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const Focus = require('../models/focus.model');
const scholarships = require('../models/scholarships.model');
const ScholarshipFocus = require('../models/scholarshipFocus.model');

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
