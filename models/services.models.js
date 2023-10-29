
const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'Campo de id faltante']
        },
        
        name: {
            type: String,
            required: [true, 'Ingresa el nombre del servicio']
        }
    }, {timestamps: true}
);

serviceSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});

module.exports = mongoose.Schema('Service', serviceSchema);
