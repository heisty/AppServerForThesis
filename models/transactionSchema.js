const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
	
	userid: {type: String},
	customer: {type: String},
	staffid: {type: String},
	staff: {type: String},
	serviceid: {type: String},
	service: {type: String},
	products: [
		{
			name: {type: String},
			quantity: {type: String},
			price: {type: String}
		}
	],
	type: {type: String},
	date: {type: Date},
	week: {type: Number},
	day: {type: Number},
	month: {type: Number},
	year: {type: Number},
	price: {type: Number},
	status: {type: String},
	rating: {type: String},
	paid: {type: Boolean}


});

module.exports = mongoose.model('transaction',transactionSchema);