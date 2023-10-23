const mongoose = require('mongoose');

const userRolSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },

    idRol : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Rol',
        required: true
    },

}, {timestamps: true});


module.exports = mongoose.model('UserRol', userRolSchema);