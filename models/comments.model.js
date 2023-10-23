
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Introduce el comentario']
    },
    status: {
        type: String,
        required: [true, 'Se requiere definir el status del comentario'],
        enum: ['Aprobado', 'Rechazado', 'Pendiente']
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)
