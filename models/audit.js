const mongoose = require('mongoose');

let audit = mongoose.Schema({
	user: {type: String},
	process: {type: String},
	type: {type: String},
	from: {type: String},
	date: {type: String},
	amount: {type: String},
	sp: {type: String},
	record: {type: String},
	ip: {type: String}

});

module.exports = mongoose.model('audit',audit);