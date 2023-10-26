const mongoose = require('mongoose');
const validator = require('validator');

const informacionFundacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico de la empresa es obligatorio'],
        validate: [validator.isEmail, 'Email inválido'],
        unique: true // Unico en la BD
    },
    telefono: {
        type: String,
        required: [true, 'El número de teléfono de la empresa es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la empresa es obligatoria']
    },
    ubicacion: {
        type: String,
        required: [true, 'La ubicación de la empresa es obligatoria']
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


module.exports = mongoose.model('InformacionFundacion', informacionFundacionSchema);;
