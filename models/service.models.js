const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Introduce el nombre del servicio']
    }
}, {timestamps: true})

module.exports = mongoose.Schema('Service', serviceSchema);