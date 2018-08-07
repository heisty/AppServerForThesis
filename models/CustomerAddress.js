const mongoose = require('mongoose');

const customerAddress = mongoose.Schema({
	userid: {type: String},
	street: {type: String},
	brgy: {type: String},
	city: {type: String},
	latitude: {type: String},
	longitude: {type: String}
});
module.exports = mongoose.model('customerAddress',customerAddress);