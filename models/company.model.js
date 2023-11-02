const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
    {
        postalCode:{
            type: String,
            required: [true, 'Ingresa un código postal']

        },
        name: {
            type: String, 
            required: [true, 'Ingresa el nombre de la certificación']
        },
        
        description: {
            type: String,
            required: [true, 'Ingresa la descripción de la certificación']
        },
        
        phone: {
            type: String,
            required: [true, 'Ingresa la fecha de adquisición de la certificación']
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('company', companySchema);
