const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const eventSchema = new mongoose.Schema(
	{
		eventName: {
			type: String,
			required: [true, 'Nombre de evento requerido'],
		},
		// What is the event about
		description: {
			type: String,
		},
		location: {
			type: String,
			required: [true, 'Ubicación requerida'],
		},
		startDate: {
			type: Date,
			required: [true, 'Fecha de inicio requerida'],
		},
		endDate: {
			type: Date,
			required: [true, 'Fecha fin requerida'],
		},
		imageUrl: {
            type: String,
            required: [true, 'Tu curso debe contar con una imagen'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        },
	}
);

// date validation
eventSchema.pre('validate', function () {
	if (this.endDate < this.startDate) {
		throw new AppError(
			'La fecha de fin no puede ser menor a la de inicio', 400
		);
	}
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;