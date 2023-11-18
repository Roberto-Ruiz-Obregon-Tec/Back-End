const certifications = require('../models/certifications.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCertifications = catchAsync(async (req, res) => {
    const partialName = req.query.name; // Get the partial name from the query parameter

    // Create a regular expression pattern to match the partial name case-insensitively
    const regexPattern = new RegExp(partialName, 'i');

    // Use the regex pattern in the query to find matching certifications
    const documents = await certifications.find({ name: regexPattern });

    res.status(200).json({
        status: 'success',
        results: documents.length,
        data: documents,
    });
});

exports.getCertification = catchAsync(async (req, res) => {
    const features = new APIFeatures(certifications.findOne({_id: req.params.id}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const documents = await features.query;
    
    res.status(200).json({
        status: 'success',
        data: documents,
    });
})

exports.createCertification = factory.createOne(certifications);
exports.updateCertification = factory.updateOne(certifications);
exports.deleteCertification = factory.deleteOne(certifications);

