const mongoose = require('mongoose')

const focusEventSchema = new mongoose.Schema({
    focus: {
        type: mongoose.Schema.ObjectId,
        ref: 'Focus',
        required: [true, 'Campo de enfoque necesario'],
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: [true, 'Campo de evento necesario'],
    }
}, { timestamps: true })

module.exports = mongoose.model('focusEvent', focusEventSchema);