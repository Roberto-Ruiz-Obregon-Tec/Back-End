const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const programSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'Es necesario que el programa tenga nombre'],
        },
        fecha_inicio: {
            type: Date,
            required: [true, 'Es necesario que el programa tenga una fecha de inicio'],
        },
        fecha_fin: {
            type: Date,
            required: [true, 'Es necesario que el programa tenga una fecha de fin'],
        },
        fecha_limite: {
            type: Date
        },
        url_imagen_curso: {
            type: String
        },
        codigo_postal_curso: {
            type: String
        },
        descripcion: {
            type: String,
        }
    },
    { timestamps: true }
);


programSchema.pre('validate', function () {
    if (
        this.fecha_limite < new Date()
    ) {
        throw new AppError('La fecha limite debe estar en el futuro', 400);
    }
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
