const factory = require('./handlerFactory.controller');
const Scholarship = require('../models/scholarships.model');

exports.getAllScholarship = factory.getAll(Scholarship);
exports.getScholarship = factory.getOne(Scholarship);
exports.createScholarship = factory.createOne(Scholarship);
exports.updateScholarship = factory.updateOne(Scholarship);
exports.deleteScholarship = factory.deleteOne(Scholarship);
