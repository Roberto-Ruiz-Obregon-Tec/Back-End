const companyCertification = require('../models/companyCertifications.model');
const company = require('../models/companies.model');
const certification = require('../models/certifications.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');

// read company
exports.getAllCompanies = factory.getAll(company);

exports.getAllCompanies = catchAsync(async (req, res, next) => {
    const companiesFeatures = new APIFeatures(company.find({}), req.query);
    const companies = await companiesFeatures.query;

    const certifications = await companyCertification.find().populate('certification'); // Obtenemos las certificaciones registradas
    
    for(let i = companies.length - 1; i >= 0; i--){
        const companyCertifications = [];

        const mapCertifications = certifications.map((c) => { // Agregamos al documento de empresa las certificaciones que tiene
            if(c.company.toString() == companies[i]._id.toString()) companyCertifications.push(c.certification.name)
        })

        if (certifications === null) { // Si la empresa no cuenta con certificaciones
            companies[i] = {...companies[i]._doc, "certifications": "Sin certificaciones"};
        } else { // Sino, agregamos las certificaciones correspondientes
            companies[i] = {...companies[i]._doc, "certifications": companyCertifications};
        }
    }

    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
          companies,
        },
    });
});
