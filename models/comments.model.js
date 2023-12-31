
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, 'Ingresa el comentario']
        },

        status: {
            type: String,
            enum: ['Aprobado', 'Rechazado', 'Pendiente'],
            required: [true, 'Ingresa el status del comentario (Aprobado, Rechazado, Pendiente)']
        },

        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Campo de usuario necesario'],
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('Comment', commentSchema)
