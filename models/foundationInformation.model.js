const mongoose = require('mongoose');
const validator = require('validator');

const foundationInformationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ingresa el nombre de la empresa']
    },
    email: {
        type: String,
        required: [true, 'Ingresa el correo electrónico de la empresa'],
        validate: [validator.isEmail, 'Email inválido'],
        unique: true // Unico en la BD
    },
    phone: {
        type: String,
        required: [true, 'Ingresa el número de teléfono de la empresa']
    },
    description: {
        type: String,
        required: [true, 'Ingresa la descripción de la empresa']
    },
    location: {
        type: String,
        required: [true, 'Ingresa la ubicación de la empresa']
    },
    facebook: {
        type: String,
        match: [/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/, 'URL de Facebook no válida']
    },
    twitter: {
        type: String,
        match: [/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/, 'URL de Twitter no válida']
    },
    instagram: {
        type: String,
        match: [/^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/, 'URL de Instagram no válida']
    },
    tiktok: {
        type: String,
        match: [/^(https?:\/\/)?(www\.)?tiktok.com\/[a-zA-Z0-9(\.\?)?]/, 'URL de TikTok no válida']
    }
}, { timestamps: true }

);


module.exports = mongoose.model('FoundationInformation', foundationInformationSchema);