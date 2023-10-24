const mongoose = require('mongoose');

const interestsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Campo de usuario necesario'],
    },
    enfoque: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enfoque',
        required: [true, 'Campo de enfoque necesario'],
    },
}, { timestamps: true });


const Interest = mongoose.model('intereses', interestsSchema);

module.exports = Interest;
