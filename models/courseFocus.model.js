
const mongoose = require('mongoose');

const courseFocusSchema = new mongoose.Schema(
    {
        course:{
            type: mongoose.Schema.ObjectId,
            ref: 'Course',
            required: [true, 'Campo de taller necesario'],

        },

        focus:{
            type: mongoose.Schema.ObjectId,
            ref: 'Focus',
            required: [true, 'Campo de enfoque necesario'],
        },

    }, {timestamps: true}
);

// Override the function 'toJSON' to present the data to the client
// Removes unnecessary properties '__v' and the creation timestamps
// and changes the '_id' to 'id' with its string representation
courseFocusSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('CourseFocus',courseFocusSchema);
