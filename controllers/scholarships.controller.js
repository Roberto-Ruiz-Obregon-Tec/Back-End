const scholarships = require('../models/scholarships.model');
const factory = require('./handlerFactory.controller');

// read certifications
exports.getAllScholarships = factory.getAll(scholarships);