const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../utils/appError');

const companyCertificationsSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: [true, 'Campo de empresa necesario'],
    },
    certification: {
        type: mongoose.Schema.ObjectId,
        ref: 'Certification',
        required: [true, 'Campo de certificación necesario'],
    }
});

// Indexing companyCertifications properties for optimized search
companyCertificationsSchema.index({ company: 1 });
companyCertificationsSchema.index({ certification: 1 });

const CompanyCertifications = mongoose.model('CompanyCertifications', companyCertificationsSchema);

module.exports = CompanyCertifications;