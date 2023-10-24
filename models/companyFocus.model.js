
const mongoose = require('mongoose');

const companyFocusSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.ObjectId,
            ref: 'Company',
            required: [true, 'Campo de empresa necesario'],
        },
        
        focus: {
            type: mongoose.Schema.ObjectId,
            ref: 'Focus',
            required: [true, 'Campo de enfoque necesario'],
        },
    }, { timestamps: true }
);


module.exports = mongoose.model('CompanyFocus', companyFocusSchema);
