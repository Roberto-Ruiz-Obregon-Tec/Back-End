const mongoose = require('mongoose');

const focusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Introduce el nombre de enfoque']
    },
}, {timestamps: true});

module.exports = mongoose.Schema('Focus', focusSchema);