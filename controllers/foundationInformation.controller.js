// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const mongoose = require('mongoose')

const foundationInformation = require('../models/foundationInformation.model');


//Get the data froma the db
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


//Update information from the db
exports.updatefoundationInformation = catchAsync(async(req, res, next) => {
    const {_id, ...restBody }= req.body
    const preFoundationInfo = await foundationInformation.findOne({_id : _id})
    
    const keys = Object.keys(preFoundationInfo._doc)


    for(let i = 0; i < keys.length; i++){
        preFoundationInfo[keys[i]] = restBody[keys[i]] || preFoundationInfo[keys[i]];
    }

    await preFoundationInfo.save({validateBeforeSave: false})


    res.status(200).json({
        status: 'success',
    });
});


