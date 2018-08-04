const User = require('../models/staffschema');
const Customer = require('../models/customerschema');
const Avail = require('../models/availSchema');
const Service = require('../models/serviceSchema');
const jwt = require('jwt-simple');
const config = require('../config.js');

function tokenForUser(user){
	var timestamp = new Date().getTime();
	return jwt.encode({
		sub: user.id,
		iat: timestamp,
	},config.secret);
}
exports.availservice = function(req,res,next){
	var {userid,serviceid,servicetype,staffid} = req.body;
	var avail = new Avail({
		userid: userid,
		serviceid: serviceid,
		servicetype: servicetype,
		staffid: staffid
	});
	avail.save(function(err){
		if(err){ return next(err)}
		return res.json({"state":"Yosh"});
	})
}
exports.alreadyhaveservice = function(req,res,next){
	var { userid } = req.body;

	Avail.findOne({userid:userid},function(err,avail){
		if(err){return next(err)}
		if(!avail){return res.json({canAvail:true})}
		res.json({canAvail:false})
	})
}
exports.staffBulk = function(req,res,next){
	User.find(function(err,staff){
	if(err){return res.json({'error': err})}
		res.json({staff});
	
	});
}

exports.services = function(req,res,next){
	Service.find(function(err,services){
		res.send({services});
	});
}

exports.addservices = function(req,res,next){
	var {title,description,price} = req.body;
	var service = new Service({
		title: title,
		description: description,
		price: price,
	});
	service.save(function(err){
		if(err){return next(err)}
		res.json({respond: 'Yosh'});
	})
}
exports.signin = function(req,res,next){
	var user = req.user;
	res.send({token: tokenForUser(user),userid: user._id,username: user.username});

}
exports.customersignin = function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;

	if(!username || !password){
		return res.status(422).json({error: 'Please Provide'});
	}
	Customer.findOne({username: username}, function(err,customer){
		if(err){ return next(err)}{
		if(!customer) {return next(err)}
		customer.comparePassword(password,function(err,isMatch){
			if(err){ return next(err)}
			if(!isMatch) {return res.status(401).json({error: 'Not Aloowe'})}
			return res.send({userid: customer._id,username:customer.username});
		})
		}
	})
	
}
exports.customersignup = function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	

	if(!username || !password){
		return res.status(422).json({error: 'Please provide'});
	}

	Customer.findOne({username: username}, function(err,existingUser){
		if(err) {return next(err)}
		if(existingUser) {return res.status(422).json({error: 'taken',statusCode: '422'});}
		var customer = new Customer({
			username: username,
			password: password,
			

		});

		customer.save(function(err){
			if(err) {return next(err)}
			res.json({userid: customer._id,username: customer.username})
		})
	})


}
exports.signup = function(req,res,next){

	var username=req.body.username;
	var password=req.body.password;
	var firstname=req.body.firstname;

	console.log(username,password);

	if(!username || !password){
		return res.status(422).json({error: 'Please provide'});
	}
	User.findOne({username: username}, function(err,existingUser){
		if(err) {return next(err);}
		if(existingUser) {return res.status(422).json({error: 'taken'});}

		var user = new User({
			username: username,
			password: password,
			firstname: firstname,
		});

		user.save(function(err){
			if(err){return next(err)}
			res.json({user_id: user._id,token: tokenForUser(user)});
		})

	})
}