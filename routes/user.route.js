const express = require('express');

const router = express.Router();

// Importing controllers for user-related actions
const {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getMyCourses
} = require(`${__dirname}/../controllers/user.controller.js`);

// Importing controllers for authentication and password management
const {
    loginUser,
    signUpUser,
    logout,
    protect,
    restrictTo,
    getMe,
    editMe,
    deleteMe
} = require(`${__dirname}/../controllers/authentication.controller.js`);
const {
    forgotPasswordUser,
    resetPasswordUser,
} = require(`${__dirname}/../controllers/password.controller.js`);

// Defining routes for various actions
router.post('/auth/signup', signUpUser); // User registration
router.post('/auth/login', loginUser); // User login
router.post('/forgotpassword', forgotPasswordUser); // Request to reset a forgotten password
router.patch('/resetpassword/:id', resetPasswordUser); // Resetting the user's password

// Middleware to protect routes (requires authentication)
router.route('/auth/me').get(protect, getMe, getUser); //Get user's own profile
router.route('/auth/updateme').patch(protect, editMe); // Update user's own information
router.route('/auth/deleteme').get(protect, deleteMe); // Delete user's own account
router.route('/auth/logout').get(protect, logout); // User logout
router.route('/mycourses').get(protect, getMyCourses); // Get user's courses

// Routes for managing user data
router.route('/').get(protect, restrictTo('Consultar usuarios'), getAllUsers).post(createUser); // Get all users or create a new user
// - GET: Retrieve a list of all users
// - POST: Create a new user

router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser); // Get, update, or delete a specific user by ID
// - GET: Retrieve a specific user by ID
// - PATCH: Update a specific user by ID
// - DELETE: Delete a specific user by ID



module.exports = router; // Export the router with defined routes
