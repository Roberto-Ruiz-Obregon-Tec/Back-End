const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const Course = require('../models/courses.model');
const Focus = require('../models/focus.model'); // Schema to perform .populate("focus")
const CourseFocus = require('../models/courseFocus.model');
const User = require('../models/users.model');
const Inscription = require('../models/inscriptions.model');
const Email = require('../utils/email');
const { request } = require('express');
const { populate } = require('../models/inscriptions.model');
const { user } = require('firebase-functions/v1/auth');

exports.getCourse = factory.getOne(Course); 
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const data = []
    let reqFocus = req.body.focus

    if(!reqFocus) reqFocus = []
    
    const features = new APIFeatures(Course.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const documents = await features.query;

    for(let i = 0; i < documents.length; i++) {
        let filter = (reqFocus.length == 0)?true:false
        const cFocus = await CourseFocus.find({course: documents[i]._id}, {focus:1}).populate("focus");

        let focus = []
        cFocus.forEach( f => { 
            focus.push(f.focus.name) 
            filter = (reqFocus.includes(f.focus.name))?true:filter
        })

        if(filter) data.push({...documents[i]._doc, "focus": focus})
    }

    res.status(200).json({
        status: 'success',
        results: data.length,
        data: data,
    });
});

/** 
 * A function that creates a course and sends an email to all the users that are interested in the
 * course.
*/
exports.createCourse = catchAsync(async (req, res, next) => {
    const document = await Course.create(req.body);

    const usersToAlert = await User.find({
        $or: [
            // Query and send mail to users in the area
            {
                postalCode: document.postalCode,
            },
            // Query and send email to users interested in topics
            { topics: { $in: document.topics } },
        ],
        emailAgreement: true,
    });

    try {
        await Email.sendMultipleNewCourseAlert(usersToAlert, document);
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando los correos de notificación.',
                500
            )
        );
    }

    res.status(201).json({
        status: 'success',
        data: {
            document,
        },
    });
});

/* A function that returns all the inscriptions of a course. */
exports.inscriptionByCourse = catchAsync(async (req, res, next) => {
    const courseID = req.params.id;

    // await because is a petition to the database
    const course = await Course.findById(courseID);

    // there's no course with that id
    // 500 is a server problem, 400 user error
    if (!course) {
        return next(new AppError('No se encontró un curso con ese ID.', 404));
    }

    // return all the inscription with the same courseID
    // .populate exchange id for the document, course has ref with user model
    const inscriptions = await Inscription.find({
        course: courseID,
    }).populate('user');

    res.status(201).json({
        status: 'success',
        data: {
            documents: inscriptions,
        },
    });
});
