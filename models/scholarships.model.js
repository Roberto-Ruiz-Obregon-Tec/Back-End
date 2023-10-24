
const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../utils/appError');

const scholarshipSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre de la beca'],
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción de la beca'],
        },
        
        organization: {
            type: String,
            required: [true, 'Ingresa la organización que patrocina la beca'],
        },
        
        location: {
            type: String,
            required: [true, 'Ingresa la ubicación en la que se ofrece la beca'],
        },
        
        email: {
            type: String,
            required: [true, 'Ingresa el email de contacto del patrocinador de la beca'],
            validate: [validator.isEmail, 'Email de contacto inválido'],
        },
        
        phone: {
            type: String,
            required: [true, 'Ingresa el teléfono de contacto del patrocinador de la beca'],
        },
        
        startDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de inicio de la beca'],
        },
        
        endDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de fin de la beca'],
        }
    }, { timestamps: true }
);

// date validation
courseSchema.pre('validate', function () {
    if (this.endDate < this.startDate) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
