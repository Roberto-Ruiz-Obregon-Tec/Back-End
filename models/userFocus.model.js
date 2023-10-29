
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

userFocusSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('UserFocus', userFocusSchema);

