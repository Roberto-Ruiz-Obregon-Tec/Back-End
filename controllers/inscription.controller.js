const factory = require('./handlerFactory.controller');
const Inscription = require('../models/inscriptions.model');
const Course = require('../models/courses.model');
const UserCourse = require('../models/userCourse.model')
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const AppError = require('../utils/appError');

/*Function that retrieves all course inscriptions */
exports.getAllInscriptions = catchAsync(async (req, res, next) => {
    // Obtenemos las inscripciones ligadas a los usuarios y cursos para que el administrador pueda aprobarlas o rechazarlas 
    const inscriptions = await Inscription.find({status: "Pendiente"}, {status: 0})
        .populate('user', {firstName: 1, lastName: 1, email: 1})
        .populate('course', {name: 1})

    

    res.status(200).json({
        status: 'success',
        results: inscriptions.length,
        data: inscriptions,
    });
})

exports.getInscription = factory.getOne(Inscription, ['user', 'course']);

exports.deleteInscription = factory.deleteOne(Inscription);

/**
 *  A function that request to inscribe a user to a course. 
 *  It first extracts the 'courseId' field, this field is necessary to
 * complete the inscription, alse it checks different areas
*/

exports.createInscription = catchAsync(async (req, res, next) => {
    const missingCourse = new AppError('Error con el curso', 404);
    const missingVoucher = new AppError('Falta el comprobante de pago', 404);
    const invalidDate = new AppError('La fecha del curso ya paso', 404);
    const capacityError = new AppError('Ya no hay capacidad para este curso', 404);
    const inscriptionError = new AppError('Ya te habias inscrito a este curso antes', 404);

    const userId = req.client.id
    const {courseId, voucher} = req.body;



exports.updateInscription = catchAsync(async (req, res, next) => {
    const missingError = new AppError('Falta algun parametro', 404);
    const statusError = new AppError('Debes elegir entre Aprobado o Rechazado', 404);
    const {inscriptionId, status} = req.body

    if (inscriptionId === undefined || status === undefined){ // Si no hay estatus o id de la inscripcion
        return next(missingError)
    }

    const inscripcion = await Inscription.findOne({_id : inscriptionId});
    const course = await Course.findOne({_id : inscripcion.course})
    if (status === 'Aprobado'){ // SI es aprobado, el curso se liga al usuario
        await UserCourse.create({course: inscripcion.course, user : inscripcion.user})
        await Inscription.deleteOne({_id : inscriptionId})

    } else if (status === 'Rechazado'){ // Si es rechazado, la inscripcion se borra
        await Course.findOneAndUpdate({_id : inscripcion.course}, {remaining: course.remaining + 1})
        await Inscription.deleteOne({_id : inscriptionId})
    } else {
        return next(statusError)
    }

    res.status(200).json({
        status: 'success'
    });
})

exports.inscribeTo = catchAsync(async (req, res, next) => {
    const courseId = req.body.courseId;

    if (!courseId) {
        return next(missingCourse);
    }

    const course = await Course.findById(courseId);

    if (!course) {
        return next(missingCourse);
    }

    if (course.cost > 0 && !voucher) {
        return next(missingVoucher);
    }

    if (course.startDate < Date.now()) {
        return next(invalidDate);
    }

    if (Number.parseInt(course.remaining) <= 0) {
        return next(capacityError);
    }

    const inscription = await Inscription.findOne({user: req.client.id, course: courseId});
   
    if (inscription) {
        return next(inscriptionError);
    }

    // Update course capacity
    await Course.updateOne({_id : courseId}, {remaining : course.remaining - 1});

    if (course.cost > 0){
        await Inscription.create({user: userId, course: courseId, status: 'Pendiente', voucher: voucher});
    } else {
        await UserCourse.create({user: userId, course: courseId})
    }
   
    
    // try {
    //     await new Email(
    //         req.client,
    //         process.env.LANDING_URL,
    //         course
    //     ).sendInscriptonAlert();
    // } catch (error) {
    //     return next(
    //         new AppError(
    //             'Hemos tenido problemas enviando un correo de confirmación.',
    //             500
    //         )
    //     );
    // }

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(200).json({
            status: 'success'
        });


    res.status(200).json({
        status: 'success'
    });
});

/** 
* It first searches for inscriptions belonging to the user making the request,
* and then populates referenced fields for each course. 
* It also sorts the courses by most recent
*/ 
exports.myInscriptions = catchAsync(async (req, res, next) => {
    const inscriptions = await Inscription.find({
        user: req.user._id,
    })
        .populate(['course'])
        .sort({ updatedAt: -1 }); // most recent courses first

    // Ios only
    if(req.headers["user-platform"] == 'ios')
    return res.status(200).json({
        status: 'success',
        results: inscriptions.length,
        data: inscriptions,
    });

    res.status(200).json({
        status: 'success',
        results: inscriptions.length,
        data: { document: inscriptions },
    });
});
