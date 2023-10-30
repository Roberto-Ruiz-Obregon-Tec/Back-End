
const mongoose = require('mongoose');

const programFocusSchema = new mongoose.Schema(
    {
        focus: {
            type: mongoose.Schema.ObjectId,
            ref: 'Focus',
            required: [true, 'Campo de enfoque necesario'],
        },
        
        program: {
            type: mongoose.Schema.ObjectId,
            ref: 'Program',
            required: [true, 'Campo de programa necesario'],
        }
    
    },
    { timestamps: true }
);

programFocusSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('programFocus', programFocusSchema);
