
const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del servicio']
        }
    }, {timestamps: true}
);

module.exports = mongoose.Schema('Service', serviceSchema);
