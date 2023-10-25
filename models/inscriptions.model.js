
const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Campo de usuario necesario'],
        },

        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course',
            required: [true, 'Campo de taller necesario'],
        },

        status: {
            type: String,
            required: [true, 'Campo de status necesario'],
        },
        
        voucher: {
            type: String,
            required: [true, 'Campo de comprobante necesario'],
        }
    }, { timestamps: true }
);



module.exports = mongoose.model('Inscription', inscriptionSchema);
