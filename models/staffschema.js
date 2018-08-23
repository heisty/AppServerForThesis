const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const staffSchema = mongoose.Schema({
	username: {type: String,unique:true},
	email: {type: String},
	password: {type: String},
	avatarlink: {type: String},
	firstname: {type: String},
	lastname: {type: String},
	contactnumber: {type: String},
	description: {type: String},
	address: {type: String},
	available: {type: Boolean},
	schedule: [
		{
			day:{type: String},
			morning: {
				_time: {type: Number},
				_endTime: {type: Number},
			},
			afternoon: {
				_time: {type: Number},
				_endTime: {type: Number},
			},
			night: {
				_time: {type: Number},
				_endTime: {type: Number}
			}
		}
	],
	location: 
		{

			latitude: {type: String},
			longitude: {type: String}

		}
	,
	skills: 
		{
			title:{type: String}
		}
	
});

staffSchema.methods.comparePassword = function(candidatePassword,callback){
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
		if(err){return callback(err)}
		return callback(null,isMatch);

	});
}

staffSchema.pre('save',function(next){
	var user = this;
	if(user.isNew || user.isModified){
	bcrypt.genSalt(10, function(err,salt){
		if(err){ return next(err)}
		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) {return next(err)}
			user.password=hash;
			next()
		});

	});
	}
	else{
		next();
	}
});

module.exports = mongoose.model('staff',staffSchema);