const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const customerSchema = mongoose.Schema({
	username: {type: String},
	password: {type: String},
	firstname: {type: String},
	lastname: {type: String},
	email: {type: String},
	contact: {type: String},
	street: {type: String},
	brgy: {type: String},
	munc: {type: String},
	city: {type: String},
	lat: {type: String},
	long: {type: String},
	deviceid: {type: String}
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
