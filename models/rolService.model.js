const mongoose = require('mongoose');

const rolServiceSchema = new mongoose.Schema({
    idService: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Service',
        required: true
    },

    idRol : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Rol',
        required: true
    },

}, {timestamps: true});


module.exports = mongoose.model('RolService', rolServiceSchema);