const mongoose = require('mongoose');

const product = mongoose.Schema({

	productname: {type: String},
	productdescription: {type: String},
	quantity: {type: Number},
	price: {type: Number},
	category: {type: String},
	type: {type: String}


});

module.exports = mongoose.model('product',product);