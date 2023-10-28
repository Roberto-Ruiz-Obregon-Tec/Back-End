
const mongoose = require('mongoose');

const focusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del enfoque']
        }
    }, {timestamps: true}
);

// Override the function 'toJSON' to present the data to the client
// Removes unnecessary properties '__v' and the creation timestamps
// and changes the '_id' to 'id' with its string representation
focusSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('Focus', focusSchema);
