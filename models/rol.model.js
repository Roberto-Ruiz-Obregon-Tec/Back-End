const mongoose = require('mongoose')

const rolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Introduce el nombre del rol']
    }
}, {timestamps: true})

module.exports = mongoose.Schema('Rol', rolSchema);