
const mongoose = require('mongoose');

const rolServiceSchema = new mongoose.Schema(
    {
        service: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Service',
            required: [true, 'Campo de servicio necesario']
        },

        rol : {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Rol',
            required: [true, 'Campo de rol necesario']
        }

    }, {timestamps: true}
);

module.exports = mongoose.model('RolService', rolServiceSchema);
