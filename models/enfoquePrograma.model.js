const mongoose = require('mongoose');

const enfoqueProgramaSchema = new mongoose.Schema(
    {
        enfoque: {
            type: mongoose.Schema.ObjectId,
            ref: 'Enfoque',
            required: [true, 'Campo de enfoque necesario'],
        },
        empresa: {
            type: mongoose.Schema.ObjectId,
            ref: 'Programa',
            required: [true, 'Campo de programa necesario'],
        },
    
    }, 
    { timestamps: true }
);


const EnfoqueEmpresa = mongoose.model('Enfoque_Programa', enfoqueProgramaSchema);

module.exports = EnfoqueEmpresa;
