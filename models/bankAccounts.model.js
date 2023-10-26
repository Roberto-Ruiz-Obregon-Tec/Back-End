
const mongoose = require('mongoose')

const bankAccountSchema = new mongoose.Schema(
    {
        bank: {
            type: String,
            required: [true, 'Ingresa el nombre del banco']
        },

        accountNumber: {
            type: Number,
            required: [true, 'Ingresa la clabe bancaria']
        },
        
        propietary: {
            type: String,
            required: [true, 'Ingresa el nombre del propietario de la cuenta']
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('BankAccount', bankAccountSchema)
