const mongoose = require('mongoose')

const userPublicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Campo de curso necesario']
        },

        publication: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Publication',
            required: [true, 'Campo de comentario necesario']
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('UserPublication', userPublicationSchema);
