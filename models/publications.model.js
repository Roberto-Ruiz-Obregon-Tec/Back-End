
const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema(
    {
        title: { 
            type: String,
            required: [true, 'Ingresa el título de la publicación']
        },

        description: { 
            type: String,
            required: [true, 'Ingresa la descripción de la publicación']
        },

        likes: { 
            type: Number,
            default: 0,
            validate: {
                validator: (likes) => likes >= 0,
            }
        },
        
        image: { 
            type: String,
            required: [true, 'Ingresa la imagen la publicación'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            }
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('Publication', publicationSchema);
