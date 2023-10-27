const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory.controller');
const foundationInformation = require('../models/foundationInformation.model');

exports.getAllfoundationInformation = factory.getAll(foundationInformation);
exports.getfoundationInformation = factory.getOne(foundationInformation);
exports.createfoundationInformation = factory.createOne(foundationInformation);
exports.updatefoundationInformation = factory.updateOne(foundationInformation);
exports.deletefoundationInformation = factory.deleteOne(foundationInformation);
