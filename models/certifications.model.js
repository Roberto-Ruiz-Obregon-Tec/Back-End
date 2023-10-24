const mongoose = require('mongoose')

const certificationSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Ingresa un nombre']
    },
    description: {
        type: String,
        required: [true, 'Ingresa una descripción']
    },
    adquisitionDate: {
        type: Date,
        required: [true, 'Ingresa la fecha de adquisición']
    }  

}, { timestamps: true })

module.exports = mongoose.model('Certification', certificationSchema)
