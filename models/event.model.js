const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Introduce el nombre del evento ']
    },
    description: {
        type: String,
        required: [true, 'Introduce el nombre del evento ']
    },
    dateStart: {
        type: Date,
        required: [true, 'Introduce la fecha de inicio del evento'],
    },
    dateEnd: {
        type: Date,
        required: [true, 'Introduce la fecha de fin del evento'],
    },
    location: {
        type: String,
        required: [true, 'Introduce la ubicación del evento'],
    },
    picture: {
        type: String,
        required: [true, 'Introduce una imagen para el evento'],
    },
}, { timestamps: true })

module.exports = mongoose.Schema('Event', eventSchema);