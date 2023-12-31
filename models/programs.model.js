
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
            type: Number,
            default: 0
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción del programa'],
        }
    }, { timestamps: true }
);


programSchema.pre('validate', function () {
    if (
        this.deadlineDate < new Date()
    ) {
        throw new AppError('La fecha limite debe estar en el futuro', 400);
    }
});

// Validación de fechas
programSchema.pre('validate', function () {
    if (this.endDate < this.startDate) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});


programSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});


module.exports = mongoose.model('Program', programSchema);
