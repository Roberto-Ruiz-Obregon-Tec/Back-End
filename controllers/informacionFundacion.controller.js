const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory.controller');
const InformacionFundacion = require('../models/informacionFundacion.model');

exports.getAllInformacionFundacion = factory.getAll(InformacionFundacion);
exports.getInformacionFundacion = factory.getOne(InformacionFundacion);
exports.createInformacionFundacion = factory.createOne(InformacionFundacion);
exports.updateInformacionFundacion = factory.updateOne(InformacionFundacion);
exports.deleteInformacionFundacion = factory.deleteOne(InformacionFundacion);
