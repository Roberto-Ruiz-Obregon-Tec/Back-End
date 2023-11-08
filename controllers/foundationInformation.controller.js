// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);

const foundationInformation = require('../models/foundationInformation.model');


//read information
exports.getAllfoundationInformation = catchAsync(async(req, res, next) => {
    info = await foundationInformation.find()

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(200).json({
            status: 'success',
            results: info.length,
            data: info,
        });

    res.status(200).json({
        status: 'success',
        results: info.length,
        data: { info },
    });
});