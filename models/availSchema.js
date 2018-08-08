const mongoose = require('mongoose');

const availSchema = mongoose.Schema({
	userid: {type: String},
	username: {type: String},
	serviceid: {type: String},
	servicename: {type: String},
	servicetype: {type: String},
	staffid: {type: String},
	staffname: {type: String},
	position: {type: Number},
	date: {type: Date}
});

module.exports = mongoose.model('avail',availSchema);