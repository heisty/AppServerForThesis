const mongoose = require('mongoose');

const orders = mongoose.Schema({
	userid: {type: String},
	serviceid: {type: String},
	servicename: {type: String},
	staffid: {type: String},
	staffname: {type: String},
	scheduledate: {type: String},
	scheduletime: {type: String},
	orderstatus: {type: String},
	orderaccepted: {type: String},
});

module.exports = mongoose.model('orders',orders);