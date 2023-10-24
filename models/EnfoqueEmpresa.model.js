const mongoose = require('mongoose');

const enfoqueEmpresaSchema = new mongoose.Schema({
    empresa: {
        type: mongoose.Schema.ObjectId,
        ref: 'Empresa',
        required: [true, 'Campo de empresa necesario'],
    },
    enfoque: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enfoque',
        required: [true, 'Campo de enfoque necesario'],
    },
}, { timestamps: true });


const EnfoqueEmpresa = mongoose.model('enfoque_empresas', enfoqueEmpresaSchema);

module.exports = EnfoqueEmpresa;
