const certifications = require('../models/certifications.model.js');
const factory = require('./handlerFactory.controller');

// read certifications
exports.getAllCertifications = factory.getAll(certifications);