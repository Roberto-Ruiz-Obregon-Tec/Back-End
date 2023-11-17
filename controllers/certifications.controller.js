const certifications = require('../models/certifications.model');
const factory = require('./handlerFactory.controller');

// read certifications
exports.getAllCertifications = factory.getAll(certifications);
exports.getCertification = factory.getOne(certifications);
exports.createCertification = factory.createOne(certifications);
exports.updateCertification = factory.updateOne(certifications);
exports.deleteCertification = factory.deleteOne(certifications);
