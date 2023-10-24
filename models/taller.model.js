const mongoose = require('mongoose');
const AppError = requre('../utils/appError');

const tallerSchema =  new mongoose.Schema(
    {
        nombre_curso: {
            type: String,
            required: [true, 'El nombre del taller es requerido'],
        },
        descripcion: {
            type: String,
        },
        ponente: {
            type: String,
            required: [true, 'Es necesario asignar al ponente del curso'],
        },
        fecha_inicio: {
            type: Date,
            required: [true, 'Fecha de incio requerida'],
        },
        fecha_fin: {
            type: Date,
            required: [true, 'Fecha de fin requerida'],
        }, 
        horario: {
            type: String,
            required: [true, 'Necesitas asignar el horario del curso'],
        },
        modalidad: {
            type: String,
            enum: { values: ['Remoto', 'Presencial'] },
            required: [
                true,
                'Modalidad del curso debe ser presencial o remoto',
            ],
        },
        codigo_postal_curso: {
            type: String,
            required: [true, 'Un curso debe tener un código postal.'],
        },
        ubicacion: {
            type: String,
        },
        estatus: {
            type: String,
            required: [true, 'El curso debe ser gratuito o de pago'],
            enum: { values: ['Gratuido', 'Pagado']}
        },
        costo: {
            type: Number,
            validate: {
                validator: (cost) => cost >= 0 && Number.isInteger(cost),
                message: 'El curso debe costar 0 o más',
            },
        },
        url_imagen_curso: {
            type: String,
            required: [true, 'Tu cruso debe contar con una portada'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        },
        capacidad: {
            type: Number,
            default: 10,
            validate: {
                validator: (value) => value >= 0,
            },
        },
        calificacion: {
            type: Number,
            default: 0,
            validate: {
                validator: (value) => value >= 0,
            },
        },
        codigo_acceso: {
            type: String,
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
                message: (props) => `${props.value} no es una URL válida`,
            },
            default: 'https://zoom.us/',
        },
        codigo_reunion: {
            type: String,
        },
    },
    { timestamps: true}
);

// Indexing course properties for optimized search
courseSchema.index({ estatus: 1 });
courseSchema.index({ modalidad: 1 });
courseSchema.index({ nombre_curso: 1 });
courseSchema.index({ codigo_postal_curso: 1 });

// date validation
courseSchema.pre('validate', function () {
    if (this.fecha_fin < this.fecha_inicio) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});

/**
 * In this case, when a course is removed, all payments and inscriptions related to it will also be deleted
 * inscriptions related to it will also be deleted
 */
courseSchema.pre('findByIdAndDelete', async function (next) {
    const Inscription = require('./inscriptions.model');
    const Payment = require('./payments.model');
    // delete the payments related with this course
    await Payment.deleteMany({
        course: this._id,
    });
    // delete every inscription related with this course id
    await Inscription.deleteMany({
        course: this._id,
    });
    // then the course is going to be deleted too
    return next();
});

const Taller = mongoose.model('Taller', tallerSchema);

module.exports = Taller;
