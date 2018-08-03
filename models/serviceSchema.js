const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
	title: {type: String},
	description: {type: String},
	type: [
		{servicetype: {type: String}}
	],
	price: {type: Number}

});

module.exports = mongoose.model('services',serviceSchema);
