const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Focus = require('../models/focus.model');
const APIFeatures = require(`../utils/apiFeatures`);


exports.getFocus = catchAsync(async (req, res, next) => {
    const focus = await Focus.find()

    res.status(200).json({
        status: 'success',
        results: focus.length,
        data: {
            focus,
        },
    });
})