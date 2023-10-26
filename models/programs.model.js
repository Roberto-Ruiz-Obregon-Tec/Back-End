
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const programSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del programa'],
        },

        startDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de inicio del programa'],
        },
        endDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de fin del programa'],
        },
        
        deadlineDate: {
            type: Date,
            required: [true, 'Ingresa la fecha límite del programa'],
        },
        
        programImage: {
            type: String,
            required: [true, 'Ingresa la imagen del programa'],
        },
        
        postalCode: {
            type: Number
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción del programa'],
        }
    }, { timestamps: true }
);


programSchema.pre('validate', function () {
    if (
        this.fecha_limite < new Date()
    ) {
        throw new AppError('La fecha limite debe estar en el futuro', 400);
    }
});

module.exports = mongoose.model('Program', programSchema);
