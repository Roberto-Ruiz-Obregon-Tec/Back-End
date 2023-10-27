
const mongoose = require('mongoose');

const rolServiceSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            ref: 'Service',
            required: [true, 'Campo de servicio necesario']
        },

        rol : {
            type: [String],
            ref: 'Rol',
            required: [true, 'Campo de rol necesario']
        }

    }, {timestamps: true}
);

module.exports = mongoose.model('RolService', rolServiceSchema);
