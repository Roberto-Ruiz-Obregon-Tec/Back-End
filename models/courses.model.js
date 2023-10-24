
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const courseSchema =  new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del curso'],
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción del curso'],
        },
        
        speaker: {
            type: String,
            required: [true, 'Ingresa el ponente del curso'],
        },
        
        startDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de incio del curso'],
        },
        
        endDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de fin del curso'],
        }, 
        
        schedule: {
            type: String,
            required: [true, 'Ingresa el horario del curso'],
        },
        
        modality: {
            type: String,
            enum: ['Remoto', 'Presencial'],
            required: [true, 'Ingresa la modalidad del curso (Remoto o Presencial)']
        },
        
        postalCode: {
            type: String,
            required: [true, 'Ingresa el código postal'],
        },
        
        location: {
            type: String,
            required: [true, 'Ingresa la ubicación del curso']
        },
        
        status: {
            type: String,
            enum: ['Gratuito', 'De pago'],
            required: [true, 'Ingresa si el curso es Gratuito o De pago'],
        },
        
        cost: {
            type: Number,
            validate: {
                validator: (cost) => cost >= 0,
            },
        },
        
        courseImage: {
            type: String,
            required: [true, 'Ingresa la imagen del curso'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        },
        
        capacity: {
            type: Number,
            default: 0,
            validate: {
                validator: (value) => value >= 0,
            },
        },
        
        rating: {
            type: Number,
            default: 0,
            validate: {
                validator: (value) => value >= 0,
            },
        },
        
        meetingCode: {
            type: String,
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
                message: (props) => `${props.value} no es una URL válida`,
            },
            default: 'https://zoom.us/',
        },
        
        accessCode: {
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


module.exports = mongoose.model('Course', courseSchema);
