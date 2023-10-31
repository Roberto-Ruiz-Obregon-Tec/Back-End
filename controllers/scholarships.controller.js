const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Scholarship = require('../models/scholarships.model');

// Básico CRUD para becas utilizando funciones de fábrica.
exports.getScholarship = factory.getOne(Scholarship);
exports.createScholarship = factory.createOne(Scholarship);
exports.updateScholarship = factory.updateOne(Scholarship);
exports.deleteScholarship = factory.deleteOne(Scholarship);

exports.getAllScholarships = catchAsync(async (req, res, next) => {
    const scholarshipFeatures = new APIFeatures(Scholarship.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const scholarships = await scholarshipFeatures.query;

    // agregar lógica adicional si necesitamos filtrar las becas
    // Por ahora, dejé este controlador simple y directo.

    res.status(200).json({
      status: 'success',
      results: scholarships.length,
      data: {
        scholarships,
      },
    });
});
