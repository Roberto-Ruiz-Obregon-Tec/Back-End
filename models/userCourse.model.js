
const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema(
    {
        course:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Course',
            required: [true, 'Campo de curso necesario'],
        },

        user:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Campo de usuario necesario'],
        },

    }, {timetamps: true}
);

module.exports = mongoose.model('UserCourse', userCourseSchema);
