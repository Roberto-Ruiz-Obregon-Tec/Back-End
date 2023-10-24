
const mongoose = require('mongoose')

const rolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del rol']
        }
    }, {timestamps: true}
)

module.exports = mongoose.Schema('Rol', rolSchema);
