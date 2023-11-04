const certifications = require('../models/certifications.model');
const factory = require('./handlerFactory.controller');

// read certifications
exports.getAllCertifications = factory.getAll(certifications);