// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const scholarships = require('../models/scholarships.model');
const factory = require('./handlerFactory.controller');

// read Scholarships
exports.getAllScholarships = factory.getAll(scholarships);