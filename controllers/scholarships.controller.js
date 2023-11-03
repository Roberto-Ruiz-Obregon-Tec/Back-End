const scholarships = require('../models/scholarships.model');
const factory = require('./handlerFactory.controller');

// read scholarships
exports.getAllScholarships = factory.getAll(scholarships);