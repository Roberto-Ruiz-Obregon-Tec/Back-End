
const mongoose = require('mongoose');

const userRolSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Campo de usuario necesario'],
        },

        rol : {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Rol',
            required: [true, 'Campo de rol necesario'],
        }

    }, {timestamps: true}
);


module.exports = mongoose.model('UserRol', userRolSchema);
