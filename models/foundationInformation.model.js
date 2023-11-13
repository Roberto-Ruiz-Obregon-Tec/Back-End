const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../utils/appError');

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
        default: "https://www.facebook.com/?locale=es_ES/",
        match: [/^(https?:\/\/)?(www\.)?facebook\.com.*/, 'URL de Facebook no válida']
    },
    twitter: {
        type: String,
        default: "https://twitter.com/?lang=es",
        match: [/^(https?:\/\/)?(www\.)?twitter.com.*/, 'URL de Twitter no válida']
    },
    instagram: {
        type: String,
        default: "https://www.instagram.com/",
        match: [/^(https?:\/\/)?(www\.)?instagram.com.*/, 'URL de Instagram no válida']
    },
    tiktok: {
        type: String,
        default: "https://www.tiktok.com/es/",
        match: [/^(https?:\/\/)?(www\.)?tiktok.com.*/, 'URL de TikTok no válida']
    }
}, { timestamps: true }

);

//Return id (not _id)
foundationInformationSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});


module.exports = mongoose.model('FoundationInformation', foundationInformationSchema);
