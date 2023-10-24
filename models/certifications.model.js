
const mongoose = require('mongoose')

const certificationSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, 'Ingresa el nombre de la certificación']
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción de la certificación']
        },
        
        adquisitionDate: {
            type: Date,
            required: [true, 'Ingresa la fecha de adquisición de la certificación']
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
