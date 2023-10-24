const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Campo de usuario necesario'],
    },
    taller: {
        type: mongoose.Schema.ObjectId,
        ref: 'Taller',
        required: [true, 'Campo de taller necesario'],
    },
    status: {
        type: String,
    },
    comprobante: {
        type: String,
    },
}, { timestamps: true });


const Inscription = mongoose.model('Inscription', inscriptionSchema);

module.exports = Inscription;
