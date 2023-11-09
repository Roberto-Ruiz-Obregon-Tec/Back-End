const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);

const bankAccount = require('../models/bankAccounts.model'); 

/* A function that returns all the bank accounts  */
exports.getAllBankAccounts = catchAsync(async (req, res, next) => {
    accounts = await bankAccount.find()

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
    const newBankAccount = await bankAccount.create({
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

