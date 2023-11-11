const companyCertification = require('../models/companyCertifications.model');
const company = require('../models/companies.model');
const certification = require('../models/certifications.model');
const CompanyFocus = require('../models/companyFocus.model');
const Focus = require('../models/focus.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')

exports.getAllCompanies = catchAsync(async (req, res, next) => {
    const req_certifications = req.body.certifications || []; // Filtros por certificación

    const companiesFeatures = new APIFeatures(company.find({}), req.query);
    const companies = await companiesFeatures.query;

    const certifications = await companyCertification.find().populate('certification'); // Obtenemos las certificaciones registradas

    for(let i = companies.length - 1; i >= 0; i--){
        const companyCertifications = [];
        let filter = (req_certifications.length === 0)? true:false; // Para verificar si cumple con los filtros

        const mapCertifications = certifications.map((c) => { // Agregamos al documento de empresa las certificaciones que tiene
            if(c.company.toString() == companies[i]._id.toString()) {
                companyCertifications.push(c.certification.name)
                filter = (req_certifications.includes(c.certification.name))? true : filter;
            }
        })

        if (certifications === null) { // Si la empresa no cuenta con certificaciones
            companies[i] = {...companies[i]._doc, "certifications": "Sin certificaciones"};
        } else { // Sino, agregamos las certificaciones correspondientes
            companies[i] = {...companies[i]._doc, "certifications": companyCertifications};
        }

        if (!filter) companies.splice(i, 1); // Si no coincide con el filtro, la quitamos de la lista
    }


    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
          companies,
        },
    });
});


exports.deleteCompany = catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del evento a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del evento a eliminar

    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en los params mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError);

    await CompanyFocus.deleteMany({company: id}); // Eliminamos los registros de los enfoques asociados al evento
    await companyCertification.deleteMany({company: id}); // Eliminamos los registros de las certificaciones asociadas al evento
    await company.deleteOne({_id : id}); // Eliminamos el evento

    res.status(200).json({
        status: 'success',
    });
});