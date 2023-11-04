
const mongoose = require('mongoose');

const userRolSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Campo de usuario necesario'],
        },

        rol : {
            type: String,
            ref: 'Rol',
            required: [true, 'Campo de rol necesario'],
        }

    }, {timestamps: true}
);

userRolSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('UserRol', userRolSchema);
