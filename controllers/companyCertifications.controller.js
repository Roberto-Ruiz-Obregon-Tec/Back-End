const companyCertification = require('../models/companyCertifications.model');
const company = require('../models/companies.model');
const certification = require('../models/certifications.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');

// read company
exports.getAllCompanies = factory.getAll(companyCertification);

// exports.getAllCompanies = catchAsync(async (req, res, next) => {
//     const companiesFeatures = new APIFeatures(company.find({}), req.query);
//     const companies = await companiesFeatures.query;

//     for(let i = companies.length - 1; i >= 0; i--){
//         const companyCertifications = [];

//         const certifications = await companyCertification.find({company: companies[i]._id}, {certification: 1, _id: 0}).populate('certification');
        
//         const mapCertifications = certifications.map((c) => {companyCertifications.push(c.certification.name)})

//         if (certifications === null) {
//             companies[i] = {...companies[i]._doc, "certifications": "Sin certificaciones"};
//         }

//         companies[i] = {...companies[i], "certifications": companyCertifications};
//     }

//     res.status(200).json({
//         status: 'success',
//         results: companies.length,
//         data: {
//           companies,
//         },
//     });
// });
