const mongoose = require('mongoose');

const focusCourseSchema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'Campo de taller necesario'],

    },

    focus:{
        type: mongoose.Schema.ObjectId,
        ref: 'Focus',
        required: [true, 'Campo de enfoque necesario'],
    },

}, {timestamps: true});

const focusCourse = mongoose.model('FocusCourse',focusCourseSchema);

module.exports = focusCourse;