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

        image: {
            type: String,
            required: [true, 'Ingresa la portada para la beca'],
        },

        sector: {
            type: String,
            default: 'Ingresa el sector que cubre la beca'
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
scholarshipSchema.pre('validate', function () {
    if (this.endDate < this.startDate) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});

// Override the function 'toJSON' to present the data to the client
// Removes unnecessary properties '__v' and the creation timestamps
// and changes the '_id' to 'id' with its string representation
scholarshipSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
