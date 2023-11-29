
const mongoose = require('mongoose');

const focusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del enfoque'],
            unique: [true, 'El focus ingresado ya ha sido registrado'],
        }
    }, {timestamps: true}
);

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
