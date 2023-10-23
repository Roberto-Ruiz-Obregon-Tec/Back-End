
const mongoose = require('mongoose')

const commentPublicationSchema = new mongoose.Schema({
    idPublication: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Publication',
        required: true
    },
    idComment: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('CommentPublication', commentPublicationSchema)
