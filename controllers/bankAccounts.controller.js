const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);

const BankAccount = require('../models/bankAccounts.model'); 

exports.createBankAccount = catchAsync(async (req, res, next) => {
    const { bank, accountNumber, propietary } = req.body;

    // Validar los datos de entrada
    if (!bank || !accountNumber || !propietary) {
        return next(new AppError('Todos los campos son obligatorios.', 400));
    }

    // Crear la cuenta bancaria en la base de datos
    const newBankAccount = await BankAccount.create({
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
