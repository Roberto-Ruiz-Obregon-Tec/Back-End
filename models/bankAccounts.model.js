
const mongoose = require('mongoose')

const bankAccountSchema = new mongoose.Schema({
    bank: {
        type: String,
        required: [true, 'Introduce el nombre del banco']
    },
    accountNumber: {
        type: Number,
        required: [true, 'Introduce la clabe bancaria']
    },
    propietary: {
        type: String,
        required: [true, 'Introduce el nombre del propietario de la cuenta']
    }
}, { timestamps: true })

module.exports = mongoose.model('BankAccount', bankAccountSchema)
