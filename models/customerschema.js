const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const customerSchema = mongoose.Schema({
	username: {type: String},
	password: {type: String},
	firstname: {type: String},
	lastname: {type: String},
	contact: {type: String},
	address: [
		{
			street: {type: String},
			brgy: {type: String},
			city: {type: String}
		}
	],
	services: [
		{
			title: {type: String},
			chosenstaff: {type: String},
			date: {type: Date},
			active: {type: Boolean},

		}
	],
	location: [
		{
			latitude: {type: String},
			longitude: {type: String}
		}
	]
});

customerSchema.methods.comparePassword =  function(candidatePassword,callback){
	bcrypt.compare(candidatePassword,this.password, function(err,isMatch){
		if(err) {return callback(err)}
		return callback(null,isMatch);
	});
}

customerSchema.pre('save',function(next){
	var customer = this;
	if(customer.isNew || customer.isModified){
		bcrypt.genSalt(10,function(err,salt){
			if(err) {return next(err)}
			bcrypt.hash(customer.password,salt,null,function(err,hash){
			customer.password = hash;
			next();
			});
		});
	}else{
		next();
	}
});

module.exports = mongoose.model('customer',customerSchema);
