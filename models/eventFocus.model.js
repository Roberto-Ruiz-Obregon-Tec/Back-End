
const mongoose = require('mongoose')

const eventFocusSchema = new mongoose.Schema(
    {
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
    }, { timestamps: true }
)

module.exports = mongoose.model('EventFocus', eventFocusSchema);
