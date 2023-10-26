
const mongoose = require('mongoose')

const commentCourseSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Course',
            required: [true, 'Campo de curso necesario']
        },

        comment: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment',
            required: [true, 'Campo de comentario necesario']
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('CommentCourse', commentCourseSchema)
