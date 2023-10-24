
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { bool } = require('sharp');

/* Creating a schema for the user name */
const nameSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
    }
);

const personalCompanySchema = new mongoose.Schema(
    {
        company: String,
        sociallyResponsible: Boolean,
    }
);

/* Creating a schema for the user model. */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: nameSchema,
            required: [true, 'Ingresa tu nombre y apellido'],
        },
        
        age: {
            type: Number,
            min: 0,
            required: [true, 'Ingresa tu edad'],
        },
        
        gender: {
            type: String,
            enum: ['Hombre', 'Mujer', 'Otro'],
            required: [true, 'Ingresa tu sexo']
        },
        
        email: {
            type: String,
            required: [true, 'Ingresa tu correo'],
            lowercase: true,
            unique: [true, 'El correo ingresado ya pertenece a otra cuenta'],
            trim: true,
            validate: [validator.isEmail, 'Introduce un correo válido'],
        },

        occupation: {
            type: String,
            required: [true, 'Ingresa tu ocupación'],
        },

        company: {
            type: personalCompanySchema,
            required: false
        },

        postalCode: {
            type: Number,
            required: [true, 'Ingresa tu código postal'],
        },
        
        password: {
            type: String,
            required: [true, 'Ingresa una contraseña'],
            // Using select prevents the field from being retrieved
            minlength: [8, 'Tu contraseña debe contar con al menos 8 caracteres'],
        },
        // The profile picture will be stored in firebase and accesed with an URL
        profilePicture: {
            type: String,
            required: false,
        },
    }, {timestamps: true}
);


// Indexing program properties for optimized search
userSchema.index({ email: 1 });

// MIDDLEWARES
/**
 * This is a middleware that runs before the save() or create() method. It hashes the password and sets
 * the passwordConfirm to undefined.
 */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        // Mongoose wont save a field if it has been set to undefined.
        this.passwordConfirm = undefined;
    }
    return next();
});

/**
 * This is a middleware that runs before the save() or create() method. Checks if the password has changed
 * and updates the passwordChangedAt attribute.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    else {
        this.passwordChangedAt = Date.now() - 1000;
        next();
    }
});

// INSTANCE METHODS
// Instance methods will be available in all document instances.

/* This is a method that compares the candidate password with the user password. */
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // This refers to the document. Since select is false we dont have access to password.
    return await bcrypt.compare(candidatePassword, userPassword);
};

/* Creating a password reset token and saving it in the database. */
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // We save the password reset token in the database.
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 10 hours
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // We return the reset token encrypted.
    return resetToken;
};

/* This method checks if the password has been changed after the token was issued. */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    // false means the password did not change
    return false;
};

/**
 * When a user is deleted, their payments as well as course inscriptions are also deleted,
 * updating the capacity of the course.
 */
userSchema.pre('remove', async function (next) {
    const Course = require('./courses.model');
    const Payment = require('./payments.model');
    const Inscription = require('./inscriptions.model');

    // search the inscriptions of the user
    const inscriptions = await Inscription.find({ user: this._id });

    // search the list of pending payments of the user
    const pendingPayments = await Payment.find({
        user: this._id,
        status: 'Pendiente',
    });
    // for each one, we look for the corresponding course and update the capacity
    for (const payment of pendingPayments) {
        const course = await Course.findById(payment.course);
        if (course) {
            await Course.findOneAndUpdate(
                { _id: course._id },
                { capacity: course.capacity + 1 }
            );
        }
        // remove the payment
        await payment.remove();
    }

    // remove all the payments related with user inscriptions
    for (const inscription of inscriptions) {
        await Payment.deleteMany({ inscription: inscription._id });
    }

    // remove the inscription
    await Inscription.deleteMany({ user: this._id });
    return next();
});

module.exports = mongoose.model('User', userSchema)
