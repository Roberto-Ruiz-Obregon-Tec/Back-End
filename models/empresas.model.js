const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
    codigo_postal: {
        type: String,
    },
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    telefono: {
        type: String,
    }
}, { timestamps: true });


const Empresa = mongoose.model('empresas', empresaSchema);

module.exports = Empresa;
