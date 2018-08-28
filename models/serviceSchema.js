const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
	title: {type: String},
	description: {type: String},
	duration: {type: Number},
	types: [{
			title: {type: String},
			description: {type: String},
			price: {type: String},
			available: {type: Boolean},
			featured: {type: Boolean},
			servicetype: [
				{s_type: {type:String}}
			]
		}],
	category: [
		{
			cat:{type: String},
		}
	],
	featured: {type: Boolean},
	available: {type: Boolean},
	type: [
		{servicetype: {type: String}}
	],
	price: {type: Number}

});

module.exports = mongoose.model('services',serviceSchema);
