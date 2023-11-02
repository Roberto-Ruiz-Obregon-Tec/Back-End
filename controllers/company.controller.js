const certifications = require('../models/company.model');
const factory = require('./handlerFactory.controller');

// read certifications
exports.getAllCompanies = factory.getAll(company);