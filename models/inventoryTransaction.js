const mongoose = require('mongoose');

let i_transaction = mongoose.Schema({
	product: {type: String},
	quantity: {type: Number},
	price: {type: Number},
	operation: {type: String},
	refer: {type: String},
	description: {type: String},
	dayName: {type: String},
	day: {type: Number},
	month: {type: Number},
	year: {type: Number},
	week: {type: Number},
	hour: {type: Number},
	minute: {type: Number}

});

module.exports = mongoose.model('itransaction',i_transaction);