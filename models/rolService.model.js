
const mongoose = require('mongoose');

const rolServiceSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            ref: 'Service',
            required: [true, 'Campo de servicio necesario']
        },

        rol : {
            type: [String],
            ref: 'Rol',
            required: [true, 'Campo de rol necesario']
        }

    }, {timestamps: true}
);

rolServiceSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.model('RolService', rolServiceSchema);
