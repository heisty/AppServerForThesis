const mongoose = require('mongoose');

const availSchema = mongoose.Schema({
	userid: {type: String},
	serviceid: {type: String},
	servicetype: {type: String},
	staffid: {type: String},
});

module.exports = mongoose.model('avail',availSchema);