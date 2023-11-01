const factory = require('./handlerFactory.controller');
const Scholarship = require('../models/scholarship.model');

exports.getAllScholarship = factory.getAll(Scholarship);
exports.getScholarship = factory.getOne(Scholarship);
exports.createScholarship = factory.createOne(Scholarship);
exports.updateScholarship = factory.updateOne(Scholarship);
exports.deleteScholarship = factory.deleteOne(Scholarship);

exports.getContactInfo = catchAsync(async (req, res, next) => {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
        return next(new AppError('No se encontró una beca con ese ID.', 404));
    }

    // Supongamos que los datos de contacto están en los campos 'email' y 'phone'
    const contactInfo = {
        email: scholarship.email,
        phone: scholarship.phone,
        location: scholarship.location,
    };

    res.status(200).json({
        status: 'success',
        data: contactInfo,
    });
});
