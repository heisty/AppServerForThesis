const mongoose = require('mongoose');

const availSchema = mongoose.Schema({
	userid: {type: String},
	username: {type: String},
	userfirstname: {type: String},
	userlastname: {type: String},

	staffid: {type: String},
	staffusername: {type: String},
	stafffirstname: {type: String},
	stafflastname: {type: String},

	service: [

	{
		serviceid: {type: String},
		servicename: {type: String},
		servicetype: {type: String},
		serviceprice: {type: Number},
		date: {type: Date},
		time: {type: Number},
		duration: {type: Number},
	}

	],
	paid: {type: Boolean},
	remit: {type: Boolean},
	total: {type: Number}
});

module.exports = mongoose.model('transactions',availSchema);