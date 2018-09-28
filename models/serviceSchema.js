const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
	
	servicename: {type: String},
	servicedescription: {type: String},
	duration: {type: Number},
	price: {type: Number},
	category: {type: String},
	type: {type: String},
	avatarURL: {type: String}

});

module.exports = mongoose.model('services',serviceSchema);
