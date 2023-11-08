// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const mongoose = require('mongoose')

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


//Update
exports.updatefoundationInformation = catchAsync(async(req, res, next) => {
    const id = req.body._id 
    
    const name = req.body.name || null
    const email = req.body.email || null 
    const phone = req.body.phone || null
    const description = req.body.description || null
    const location = req.body.location || null
    const facebook = req.body.facebook || null
    const twitter = req.body.twitter || null
    const instagram = req.body.instagram || null
    const tiktok = req.body.tiktok || null

    if(req.body.name != null){
        await foundationInformation.updateOne({_id: id}, {$set: {name : name}})
    }
    if(req.body.email != null){
        await foundationInformation.updateOne({_id: id}, {$set: {email : email}})
    }
    if(req.body.phone != null){
        await foundationInformation.updateOne({_id: id}, {$set: {phone : phone}})
    }
    if(req.body.description != null){
        await foundationInformation.updateOne({_id: id}, {$set: {description : description}})
    }
    if(req.body.location != null){
        await foundationInformation.updateOne({_id: id}, {$set: {location : location}})
    }
    if(req.body.facebook != null){
        await foundationInformation.updateOne({_id: id}, {$set: {facebook : facebook}})
    }
    if(req.body.twitter != null){
        await foundationInformation.updateOne({_id: id}, {$set: {twitter : twitter}})
    }
    if(req.body.instagram != null){
        await foundationInformation.updateOne({_id: id}, {$set: {instagram : instagram}})
    }
    if(req.body.tiktok != null){
        await foundationInformation.updateOne({_id: id}, {$set: {tiktok : tiktok}})
    }

    res.status(200).json({
        status: 'success',
    });
});


