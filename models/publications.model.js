
const mongoose = require('mongoose')

const publicationSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'Introduce el título de la publicación']
    },
    description: { 
        type: String,
        required: [true, 'Introduce la descripción de la publicación']
    },
    likes: { 
        type: Number,
        default: 0 
    },
    image: { 
        type: String,
        required: [true, 'Introduce la imagen la publicación']
    }
}, { timestamps: true })

module.exports = mongoose.model('Publication', publicationSchema)
