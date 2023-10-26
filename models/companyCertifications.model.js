
const mongoose = require('mongoose');

const companyCertificationSchema = new mongoose.Schema(
    {
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
    }, { timestamps: true }
);

// Indexing companyCertifications properties for optimized search
companyCertificationsSchema.index({ company: 1 });
companyCertificationsSchema.index({ certification: 1 });

module.exports = mongoose.model('CompanyCertification', companyCertificationSchema);
