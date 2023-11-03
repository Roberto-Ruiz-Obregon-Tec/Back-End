// Functions to fabricate controllers
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);


const scholarships = require('../models/scholarships.model');

// read certifications
exports.getScholarships = catchAsync(async (req, res, next) => {
    let filter = {};
    let query = scholarships.find(filter).select('name sector description organization');
    
    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .paginate();
    
    const becas = await features.query;

    // Ios only
    if(req.headers["user-platform"] == 'ios')
        return res.status(200).json({
            status: 'success',
            results: becas.length,
            data: becas,
        });

    res.status(200).json({
        status: 'success',
        results: becas.length,
        data: { becas },
    });
});
