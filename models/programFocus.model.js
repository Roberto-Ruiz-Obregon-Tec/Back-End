
const mongoose = require('mongoose');

const programFocusSchema = new mongoose.Schema(
    {
        focus: {
            type: mongoose.Schema.ObjectId,
            ref: 'Focus',
            required: [true, 'Campo de enfoque necesario'],
        },
        
        company: {
            type: mongoose.Schema.ObjectId,
            ref: 'Program',
            required: [true, 'Campo de programa necesario'],
        }
    
    },
    { timestamps: true }
);

module.exports = mongoose.model('programFocus', programFocusSchema);
