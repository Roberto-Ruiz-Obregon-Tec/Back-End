
const mongoose = require('mongoose');

const scholarshipFocusSchema = new mongoose.Schema(
    {
        scholarship: {
            type: mongoose.Schema.ObjectId,
            ref: 'Scholarship',
            required: [true, 'Campo de beca necesario'],
        },

        focus: {
            type: mongoose.Schema.ObjectId,
            ref: 'Focus',
            required: [true, 'Campo de enfoque necesario'],
        }
    }, { timestamps: true }
);

// Indexing focusScholarship properties for optimized search
focusScholarshipSchema.index({ scholarship: 1 });
focusScholarshipSchema.index({ focus: 1 });

module.exports = mongoose.model('ScholarshipFocus', scholarshipFocusSchema);
