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
	var {userid,username,serviceid,servicename,servicetype,staffid,staffname,position} = req.body;
	var avail = new Avail({
		userid: userid,
		username: username,
		serviceid: serviceid,
		servicename: servicename,
		servicetype: servicetype,
		staffid: staffid,
		staffname: staffname,
		position: position,
		date: new Date(),
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
exports.customerBulk = function(req,res,next){
	Customer.find(function(err,customer){
	if(err){return res.json({'error': err})}
		res.json({customer});
	
	});
}

exports.deleteservices = function(req,res,next){
	let {serviceid} = req.body;
	
	Service.deleteOne({_id:serviceid},function(err,success){
		if(err){return next(err)}
		if(!success){return res.json({"NODEL":success})}
		res.json("DEL");
	})
}

exports.deleteById = function(req,res,next){
	let {staffid} = req.body;
	console.log(staffid);
	User.deleteOne({_id:staffid},function(err,success){
		if(err){return next(err)}
		if(!success){return res.json({"NODEL":success})}
		res.json("DEL");
	})
}
exports.deleteByCustomerId = function(req,res,next){
	let {userid} = req.body;
	console.log(userid);
	Customer.deleteOne({_id:userid},function(err,success){
		if(err){return next(err)}
		if(!success){return res.json({"NODEL":success})}
		res.json("DEL");
	})
}

exports.staffBulk = function(req,res,next){
	User.find(function(err,staff){
	if(err){return res.json({'error': err})}
		res.json({staff});
	
	});
}

exports.staffSpecialBulk = function(req,res,next){
	let {servicename} = req.body;
	User.find({'skills.title':servicename},function(err,staff){
	if(err){return res.json({'error': err})}
		res.json({staff});
	
	});
}

exports.services = function(req,res,next){
	let {
		category
	} = req.body;
	Service.find({'category.cat':category},function(err,service){
		res.send({service});
	});
}

exports.addservices = function(req,res,next){
	var {title,description,cat,featured,available,servicetype,price,t_title,t_description,t_price,t_available,t_featured,t_servicetype} = req.body;
	var service = new Service({
		title: title,
		description: description,
		types: [{
			title: t_title,
			description: t_description,
			price: t_price,
			available: t_available,
			featured: t_featured,
			servicetype: [
				{type: t_servicetype}
			]
		}],
		category: [
			{
				cat: "All",
			},
			{
				
				cat:cat
			}
		],
		featured: featured,
		available: available,
		type: [
			{servicetype: servicetype}
		],
		price: price,

	});
	service.save(function(err){
		if(err){return next(err)}
		res.json({respond: 'Yosh'});
	})
}

exports.updateservices = function(req,res,next){
	let { serviceid,title,description,price } = req.body;

	let service = new Service({
		title: title,
		description: description,
		price: price
	});

	let serviceObject = service.toObject();
	delete serviceObject._id;

	Service.update({_id:serviceid},serviceObject,function(err){
		if(err){return next(err)}
		return res.json("Updated");
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
	var { username,password,firstname,lastname,email,contact,street,brgy,munc,city,lat,long } = req.body;
	
	User.findOne({username:username},function(err,exist){
		if(err){return next(err)}
		if(exist){return res.status(422).json({error: 'taken',statusCode: '422'});}

	if(!username || !password){
		return res.status(422).json({error: 'Please provide'});
	}

	Customer.findOne({username: username}, function(err,existingUser){
		if(err) {return next(err)}
		if(existingUser) {return res.status(422).json({error: 'taken',statusCode: '422'});}
		var customer = new Customer({
			username: username,
			password: password,
			firstname: firstname,
			lastname: lastname,
			email: email,
			contact: contact,
			street: street,
			brgy: brgy,
			munc: munc,
			city: city,
			lat: lat,
			long: long,

		});

		customer.save(function(err){
			if(err) {return next(err)}
			res.json({userid: customer._id,username: customer.username})
		})
	})
	})


}
exports.signup = function(req,res,next){

	var {
		username,
		password,
		email,
		avatarLink,
		firstname,
		lastname,
		contactnumber,
		description,
		available,
		day,
		m_time,
		m_endTime,
		a_time,
		a_endTime,
		n_time,
		n_endTime,
		address,
		lat,
		long,
		skill
	} = req.body;

	console.log(username,password);

	if(!username || !password){
		return res.status(422).json({error: 'Please provide'});
	}
	User.findOne({username: username}, function(err,existingUser){
		if(err) {return next(err);}
		if(existingUser) {return res.status(422).json({error: 'taken'});}

		var user = new User({
			username: username,
			email:email,
			avatarLink: avatarLink,
			password: password,
			firstname: firstname,
			lastname: lastname,
			contactnumber: contactnumber,
			description: description,
			address: address,
			available:available,
			schedule: [
				{
					day: day,
					
					morning: {
						_time:m_time,
						_endTime:m_endTime,
					},
					afternoon: {
						_time:a_time,
						_endTime:a_endTime,
					},
					night: {
						_time:n_time,
						_endTime:n_endTime,
					}
				}
			],
			location: {
				latitude:lat,
				longitude:long
			},
			skills: [
				{
					title:skill
				}
			]
		});

		user.save(function(err){
			if(err){return next(err)}
			res.json({user_id: user._id,token: tokenForUser(user)});
		})

	})
}