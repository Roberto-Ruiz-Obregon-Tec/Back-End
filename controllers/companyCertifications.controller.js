const companyCertifications = require('../models/companyCertifications.model');
const factory = require('./handlerFactory.controller');

// read company certifications
exports.getAllCompanyCertifications = factory.getAll(companyCertifications);