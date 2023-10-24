const mongoose = require('moongose');

const userCourseSchema = new mongoose.Schemma({
    idCourse:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Course',
        required: true


    },

    idUser:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },

}, {timetamps: true});

module.exports = mongoose.model('UserCourse', userCourseSchema);