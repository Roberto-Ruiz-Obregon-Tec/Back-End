
const mongoose = require('mongoose')

const rolSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'Campo de id faltante']
        },
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del rol']
        }
    }, {timestamps: true}
)

module.exports = mongoose.model('Rol', rolSchema);
