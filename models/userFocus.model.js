
const mongoose = require('mongoose');

const userFocusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Campo de usuario necesario'],
        },
        
        focus: {
            type: mongoose.Schema.ObjectId,
            ref: 'Focus',
            required: [true, 'Campo de enfoque necesario'],
        }
    }, { timestamps: true }
);



module.exports = mongoose.model('UserFocus', userFocusSchema);

