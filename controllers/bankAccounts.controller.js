const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);

const bankAccount = require('../models/bankAccounts.model'); 


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

exports.createBankAccount = catchAsync(async (req, res, next) => {
    const { bank, accountNumber, propietary } = req.body;

    // Validar los datos de entrada
    if (!bank || !accountNumber || !propietary) {
        return next(new AppError('Todos los campos son obligatorios.', 400));
    }

    // Crear la cuenta bancaria en la base de datos
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

