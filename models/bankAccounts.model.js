
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
        },

        bankImage: {
            type: String,
            required: [true, 'Ingresa la imagen del banco'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        }
    }, { timestamps: true, versionKey: false  }
    
)

module.exports = mongoose.model('BankAccount', bankAccountSchema)
