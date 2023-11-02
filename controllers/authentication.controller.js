const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Inscription = require('./../models/inscriptions.model');

const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
const AppError = require('./../utils/appError');

const User = require('./../models/users.model');
const UserRol = require('../models/userRol.model')
const RolService = require('../models/rolService.model');
const Service = require('../models/services.models');

/**
 * This function takes an id as an argument and returns a signed JWT token with the id as the payload
 * and the JWT_SECRET and JWT_EXPIRES_IN as the secret and expiration time respectively.
 * @param id - the user id
 * @returns The signToken function is returning a JWT token.
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * It creates a JWT token, sets the cookie options, sets the cookie, and sends the response.
 * @param user - the user object that we just created or updated
 * @param statusCode - The HTTP status code to send back to the client.
 * @param req - The request object
 * @param res - the response object
 */
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    // WEB ONLY - FOR ADMINISTRATORs LOGIN
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure,
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    // Ios only
    if(req.headers["user-platform"] == 'ios')
    return res.status(statusCode).json({
        status: 'success',
        token,
        data: user,
    });

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

/**
 * The above code is checking if the user is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if its there
    // We will be receiving the token in a header in the request.
    let token;
    if (
        // It is an standard that the authorizarrion header includes the word Bearer
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];

        // WEB ONLY
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    //console.log(token);
    
    if (!token) {
        return next(
            new AppError(
                'No has iniciado sesión, por favor inicia sesión antes de ingresar.',
                401
            ) //401 means not authorized
        );
    }
    // 2) Verification: Validate the token to view if the signature is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // decoded will be the payload of the JWT

    // 3) Check if user still exists
    const client = await User.findById(decoded.id);
    
    if (!client) {
        return next(new AppError('El usuario ya no existe.', 401));
    }

    // 4) Check if user changed passwords after the token was issued
    if (client.changedPasswordAfter(decoded.iat)) {
        // iat - issued at
        return next(
            new AppError(
                'User recently changed password! Please login again',
                401
            )
        );
    }
    
    // 5) Storing client info and calling Next to access the protected route
    req.client = client;
    
    const rol = await UserRol.findOne({user: client._id}, {rol: 1}).populate('rol');
    req.rolId = rol.rol._id
    req.rol = rol.rol.name

    next();
});

/* Creating a new user. */
exports.signUpUser = catchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        age,
        gender,
        email,
        occupation,
        company,
        sociallyResponsibleCompany,
        postalCode,
        password,
        profilePicture,
    } = req.body;

    const newUser = await User.create({
        firstName,
        lastName,
        age,
        gender,
        email,
        occupation,
        company,
        sociallyResponsibleCompany,
        postalCode,
        password,
        profilePicture
    });

    // Link to rol user
    const nRol = new UserRol({
        user: newUser._id,
        rol: "R001"
    });

    await nRol.save();

    /*try {
        await new Email(newUser, process.env.LANDING_URL).sendWelcome();
    } catch (error) {
        return next(
            new AppError(
                'Hemos tenido problemas enviando un correo de bienvenida.',
                500
            )
        );
    } */

    return createSendToken(newUser, 201, req, res);
});

/* Creating a new admin. */
exports.signUpAdmin = catchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        age,
        gender,
        email,
        postalCode,
        password,
    } = req.body;

    const newUser = await User.create({
        firstName,
        lastName,
        age,
        gender,
        email,
        postalCode,
        password,
    });

    // Link to rol admin
    const nRol = new UserRol({
        user: newUser._id,
        rol: "R002"
    });

    await nRol.save();

    // try {
    //     await new Email(newUser, process.env.LANDING_URL).sendWelcome();
    // } catch (error) {
    //     return next(
    //         new AppError(
    //             'Hemos tenido problemas enviando un correo de bienvenida.',
    //             500
    //         )
    //     );
    // }

    // After signup a verified admin must approve the new admin
    res.status(200).json({
        status: 'success',
        message:
            '¡Has registrado una cuenta de administrador con éxito!',
    });
});

/**
 * Checking if the user is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
exports.loginUser = catchAsync(async (req, res, next) => {
    const req_email = req.body.email;
    const req_password = req.body.password;

    if (!req_email || !req_password) {
        // After calling next we want the function to end and send an error.
        return next(
            new AppError(
                'Por favor ingrese un email y contraseña válidos.',
                400
            )
        );
    }

    // 2 Check is user exists.
    const user = await User.findOne({email: {$eq: req_email}})

    if (!user || !(await user.correctPassword(req_password, user.password))) {
        return next(new AppError('Email o contraseña incorrectos.', 401));
    }

    // 3 Send JWT to user.
    createSendToken(user, 201, req, res);
});

/**
 * Checking if the admin is logged in. If the user is logged in, the user is allowed
 * to access the protected route. If the user is not logged in, the user is not allowed to access the
 * protected route.
 */
exports.loginAdmin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        // After calling next we want the function to end and send an error.
        return next(
            new AppError(
                'Por favor ingrese un email y contraseña válidos.',
                400
            )
        );
    }

    // 2 Check is user exists and has been verified.
    const user = await User.findOne({email: {$eq: req_email}})

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email o contraseña incorrectos.', 401));
    }

    const rol = await UserRol.findOne({user: user._id});
    
    if (!rol || rol.rol !== "R002") {
        return next(
            new AppError(
                'No tienes permiso para iniciar sesión en esta plataforma.',
                401
            )
        );
    }
    // 3 Send JWT to user.
    createSendToken(user, 201, req, res);
});

/* Setting the cookie to loggedout and then sending a response. */
exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({ status: 'success' });
};

/* Setting the user id to the params id. */
exports.getMe = catchAsync(async (req, res, next) => {
    // Using this route before getOne lets us leverage the already created endpoint.
    let userActive = req.rol == 'Administrador' ? req.admin : req.user;
    req.params.id = userActive._id;
    next();
});

/* Setting the user id to the params id. */
exports.getMyCourses = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const results = await Inscription.aggregate([
        {
            $match: {
                user: userId,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
    ]);

    const courses = results.map((ins) => ins.course);

    // Ios only
    if(req.headers["user-platform"] == 'ios')
    return res.status(200).json({
        status: 'success',
        results: courses.length,
        data: courses,
    });

    // 3 respond with update
    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: {
            documents: courses,
        },
    });
});

/* Updating the user or admin. */
exports.editMe = catchAsync(async (req, res, next) => {
    // 1 Check for password
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'Para cambiar tu contraseña debes usar otra ruta. Usa esta función solo para cambiar tu perfil.',
                400
            )
        );
    }

    let userActive = req.rol == 'Administrador' ? req.admin : req.user;
    // 2 Update document
    const user = await User.findByIdAndUpdate(userActive._id, req.body, {
        // queremos que regrese el viejo
        new: true,
        runValidators: true,
    });

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(200).json({
            status: 'success',
            data: user,
        });


    // 3 respond with update
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/* Deletes the user by its id*/
exports.deleteMe = catchAsync(async (req, res, next) => {
    let userActive = req.rol == 'Administrador' ? req.admin : req.user;

    if (req.rol == 'Administrador') {
        return next(
            new AppError('Esta función es sólo para borrar usuarios.', 400)
        );
    }

    // 2 Update document
    const user = await User.findByIdAndDelete(userActive._id);

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(200).json({
            status: 'success',
            data: user,
        });


    // 3 respond with update
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/* Restricting the user to a certain role. */
exports.restrictTo = (service) => {
    return catchAsync(async(req, res, next) => {
        const idService = await Service.findOne({name: service}, {_id : 1}); // id asociado al servicio
        const roles = await RolService.findOne({service: idService._id}); // roles asociados al servicio

        if (!roles.rol.includes(req.rolId)) { // Verificamos que el usuario tenga acceso al servicio
            next(
                new AppError(
                    'No cuentas con los permisos para realizar esta acción.',
                    403
                )
            );
        }
        
        next();
    });
};
