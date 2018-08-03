const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
	serviceId: {type: String},
	date: {type: Date},
	tip: {type: String}


});

module.exports = mongoose.model('transaction',transactionSchema);