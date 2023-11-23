
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        postalCode: {
            type: String,
            required: [true, 'Ingresa el código postal de la empresa'],
        },
        
        name: {
            type: String,
            required: [true, 'Ingresa el nombre de la empresa'],
            unique: [true, 'La empresa ingresada ya ha sido registrada'],
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción de la empresa'],
        },
        
        phone: {
            type: String,
            required: [true, 'Ingresa el teléfono de la empresa'],
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
