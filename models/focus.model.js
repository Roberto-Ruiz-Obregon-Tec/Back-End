
const mongoose = require('mongoose');

const focusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del enfoque']
        }
    }, {timestamps: true}
);

module.exports = mongoose.Schema('Focus', focusSchema);
