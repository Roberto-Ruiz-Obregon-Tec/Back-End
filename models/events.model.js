
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del evento ']
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa el nombre del evento ']
        },
        
        startDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de inicio del evento'],
        },
        
        endDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de fin del evento'],
        },
        
        location: {
            type: String,
            required: [true, 'Ingresa la ubicación del evento'],
        },
        
        image: {
            type: String,
            required: [true, 'Ingresa una imagen para el evento'],
        },
    }, { timestamps: true }
);

module.exports = mongoose.Schema('Event', eventSchema);
