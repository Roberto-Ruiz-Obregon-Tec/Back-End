const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);

const bankAccounts = require('../models/bankAccounts.model'); 

/* A function that returns all the bank accounts  */
exports.getAllBankAccounts = catchAsync(async (req, res, next) => {
    accounts = await bankAccounts.find()

    // Ios only
    if(req.headers["user-platform"] == 'ios')
    return res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: accounts,
    });

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: { accounts },
    });


});

/* A function that allows admins to create new Bank Accounts */
exports.createBankAccount = catchAsync(async (req, res, next) => {
    const { bank, accountNumber, propietary } = req.body;

    // Validate data entry
    if (!bank || !accountNumber || !propietary) {
        return next(new AppError('Todos los campos son obligatorios.', 400));
    }

    // Create the account
    const newBankAccount = await bankAccounts.create({
        bank,
        accountNumber,
        propietary,
    });

    res.status(200).json({
        status: 'success',
        data: {
        bankAccount: newBankAccount,
        },
    });
});


/* A function that allows admins to modifie bank Accounts */
exports.updateBankAccount = catchAsync(async(req, res, next) => {
    const {_id, ...restBody }= req.body
    const preBankAccounts = await bankAccounts.findOne({_id : _id})
    
    const keys = Object.keys(preBankAccounts._doc)


    for(let i = 0; i < keys.length; i++){
        preBankAccounts[keys[i]] = restBody[keys[i]] || preBankAccounts[keys[i]];
    }

    await preBankAccounts.save({validateBeforeSave: false})


    res.status(200).json({
        status: 'success',
    });
});