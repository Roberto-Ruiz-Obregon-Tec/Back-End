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
		startDate: {
			type: Date,
			required: [true, 'Fecha de inicio requerida'],
		},
		endDate: {
			type: Date,
			required: [true, 'Fecha fin requerida'],
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