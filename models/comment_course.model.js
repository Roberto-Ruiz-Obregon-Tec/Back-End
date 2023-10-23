
const mongoose = require('mongoose')

const commentCourseSchema = new mongoose.Schema({
    idCourse: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Course',
        required: true
    },
    idComment: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('CommentCourse', commentCourseSchema)
