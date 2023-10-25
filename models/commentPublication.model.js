
const mongoose = require('mongoose')

const commentPublicationSchema = new mongoose.Schema(
    {
        publication: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Publication',
            required: [true, 'Campo de publicación necesario']
        },
        
        comment: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment',
            required: [true, 'Campo de comentario necesario']
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('CommentPublication', commentPublicationSchema)
