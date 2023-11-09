
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
            required: [true, 'Ingresa el nombre del ponente del curso'],
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
            type: Number
        },
        
        location: {
            type: String
        },
        
        status: {
            type: String,
            enum: ['Gratuito', 'De pago'],
            required: [true, 'Ingresa si el curso es Gratuito o De pago'],
        },
        
        cost: {
            type: Number,
            default: 0,
            validate: {
                validator: (cost) => cost >= 0,
            }
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
                validator: (value) => value >= 0 && value <= 5,
            },
            set: (value) => parseFloat(value.toFixed(2))
        },

        ratingCount: {
            type: Number,
            default: 10,
            validate: {
                validator: (value) => value >= 0,
            },
        },
        
        meetingCode: {
            type: String,
            default: 'https://zoom.us/',
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
                message: (props) => `${props.value} no es una URL válida`,
            }
        },
        
        accessCode: {
            type: String,
            default: ""
        },
    },
    { timestamps: true}
);

// Validación de fechas
courseSchema.pre('validate', function () {
    if (this.fecha_fin < this.fecha_inicio) {
        throw new AppError(
            'La fecha final debe ser menor a la fecha inicial',
            400
        );
    }
});

// Override the function 'toJSON' to present the data to the client
// Removes unnecessary properties '__v' and the creation timestamps
// and changes the '_id' to 'id' with its string representation
courseSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
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
