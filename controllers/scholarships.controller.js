// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require(`../utils/apiFeatures`);
const Scholarship = require('../models/scholarships.model');


exports.getAllScholarship = factory.getAll(Scholarship);
exports.getScholarship = factory.getOne(Scholarship);
exports.createScholarship = factory.createOne(Scholarship);
exports.updateScholarship = factory.updateOne(Scholarship);
exports.deleteScholarship = factory.deleteOne(Scholarship);