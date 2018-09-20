const mongoose = require('mongoose');

const suggestion = mongoose.Schema({

	userid: {type: String},
	customer: {type: String},
	suggestion: {type: String}

});

module.exports = mongoose.model('suggestion',suggestion);