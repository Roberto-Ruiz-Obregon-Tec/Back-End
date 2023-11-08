const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const User = require('../models/users.model');
const UserRol = require('../models/userRol.model');
const UserFocus = require('../models/userFocus.model');
const Focus = require('../models/focus.model'); // Reference to the Focus model
const Rol = require('../models/rols.model'); // Reference to the Rol model

// Export controller functions for handling User data
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, ['topics']);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// Controller function to get all users with additional filtering and population
exports.getAllUsers = catchAsync(async (req, res, next) => {
    // Create an instance of APIFeatures for filtering, sorting, limiting, and pagination
    const userFeatures = new APIFeatures(User.find({}, { password: 0 }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    // Execute the query to fetch users
    const users = await userFeatures.query;

    // Filter users based on role and focus criteria
    const req_rol = req.body.rol || ""; // Filter by role
    const req_focus = req.body.focus || []; // Filter by focus

    // Fetch UserRol and UserFocus data for reference
    const userRols = await UserRol.find().populate('rol'); // Get the tables of users associated with roles
    const userFocus = await UserFocus.find().populate('focus'); // Get the list of interests (focus) associated with the program

    // Iterate through the users to apply role and focus filtering
    for (let i = users.length - 1; i >= 0; i--) {
        const focusList = [];
        let focusFilter = (req_focus.length == 0) ? true : false;

        // Find the role of the user
        const rol = userRols.find(userInfo => userInfo.user.toString() == users[i]._id.toString());

        if (rol === undefined || rol === null) { // If the user has no role
            users[i] = { ...users[i]._doc, "rol": "No assigned role" };
        } else { // Add the role field
            users[i] = { ...users[i]._doc, "rol": rol.rol.name };
        }

        // Check and filter based on user's focus
        const mapFocus = userFocus.map(f => {
            if (f.user.toString() === users[i]._id.toString()) {
                focusList.push(f.focus.name);
                focusFilter = req_focus.includes(f.focus.name) ? true : focusFilter;
            }
        });

        users[i] = { ...users[i], "focus": focusList }; // Add the list of interests

        if ((req_rol !== "" && users[i].rol != req_rol) || !focusFilter) {
            users.splice(i, 1); // Remove the record if it doesn't match the role or focus filter
        }
    }

    // Send the filtered user data as a response
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});
