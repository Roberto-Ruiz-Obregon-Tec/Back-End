const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../utils/appError');

const scholarshipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nombre de la beca requerido'],
    },
    description: {
        type: String,
        required: [true, 'Descripción de la beca requerida'],
    },
    organization: {
        type: String,
        required: [true, 'Organización que patrocina la beca requerida'],
    },
    location: {
        type: String,
        required: [true, 'Ubicación de la beca requerida'],
    },
    email: {
        type: String,
        required: [true, 'Email de contacto requerido'],
        validate: [validator.isEmail, 'Email inválido'],
    },
    phone: {
        type: String,
        required: [true, 'Teléfono de contacto requerido'],
    },
    startDate: {
        type: Date,
        required: [true, 'Fecha de inicio requerida'],
    },
    endDate: {
        type: Date,
        required: [true, 'Fecha de fin requerida'],
    }
}, { timestamps: true });

// date validation
courseSchema.pre('validate', function () {
    if (this.endDate < this.startDate) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

module.exports = Scholarship;