const mongoose = require('mongoose');

const activeCustomerService = mongoose.Schema({
	userid: {type:String},
	serviceid: {type: String},
	servicename: {type: String},
	servicetype: {type: String},
	staffid: {type: String},
	staffname: {type: String},
	date: {type: Date},
	active: {type: Boolean}
});

module.exports = mongoose.model('activeServices',activeCustomerService);
