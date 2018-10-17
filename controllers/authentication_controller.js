const User = require('../models/staffschema');
const Customer = require('../models/customerschema');
const Avail = require('../models/availSchema');
const Service = require('../models/serviceSchema');
const jwt = require('jwt-simple');
const config = require('../config.js');
const bcrypt = require('bcrypt-nodejs');
const Admin  = require('../models/adminSchema');

function tokenForUser(user){
	var timestamp = new Date().getTime();
	return jwt.encode({
		sub: user.id,
		iat: timestamp,
	},config.secret);
}

exports.changeCustomerPassword = function(req,res,next){
	let {
		userid,
		oldpassword,
		password
	} = req.body;

	

	Customer.findOne({_id:userid},function(err,customer){
		if(err){return next(err)}
		if(customer){
			customer.comparePassword(oldpassword,function(err,isMatch){
				if(isMatch){
				
				bcrypt.genSalt(10,function(err,salt){
					if(err) {return next(err)}
					bcrypt.hash(password,salt,null,function(err,hash){
					password = hash;
					
					Customer.update({_id:userid},{$set: {password:hash}},function(err){
					if(err){return next(err)}
					res.json("Updated");
					})


					});
				});		

				


				}
				if(!isMatch){
					res.json({status:'000'});
				}
			})
		}
	})
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

	console.log(category);
	
	if(!category || category==="All"){
		Service.find({},function(err,service){
		res.send({service});
	});
	}
	if(category && category!=="All"){
		Service.find({category},function(err,service){
		res.send({service});
	});
	}
}

exports.addservices = function(req,res,next){
	
	let service = new Service({
		...req.body,
		type: "service",
	})

	service.save(function(err){
		if(err){return next(err)}
		res.json({respond: 'Yosh'});
	})
}

exports.updateservices = function(req,res,next){
	let {
		_id
	} = req.body;

	let service = new Service({
		...req.body,
		type: "service"
	});

	let serviceObject = service.toObject();
	delete serviceObject._id;

	Service.update({_id:_id},serviceObject,function(err){
		if(err){return next(err)}
		return res.json("Updated");
	})
}
exports.signin = function(req,res,next){
	var user = req.user;
	res.send({token: tokenForUser(user),userid: user._id,username: user.username,staff:`${user.firstname} ${user.lastname}`});

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
	var { username,password,firstname,lastname,email,contact,street,brgy,munc,city,lat,long,deviceid } = req.body;
	
	User.findOne({username:username},function(err,exist){
		if(err){return next(err)}
		if(exist){return res.status(422).json({error: 'taken',statusCode: '422'});}

	if(!username || !password){
		return res.status(422).json({error: 'Please provide'});
	}

	Customer.findOne({$or:[{username:username}]}, function(err,existingUser){
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
			deviceid: deviceid,
			verified:true,

		});

		customer.save(function(err){
			if(err) {return next(err)}
			res.json({userid: customer._id,username: customer.username})
		})
	})
	})


}

exports.signup = function(req,res,next){

	// let {
	// 	username,
	// 	password
	// } = req.body;

	console.log(req.body);

	// if(!username || !password){
	// 	return res.status(422).json({error: 'Please provide'});
	// }
	

		let user = new User({
			...req.body,
			available:true,
			deviceid:0,
		});

		user.save(function(err){
			if(err){return next(err)}
			res.json("OK");
		})
	

}

// exports.signup = function(req,res,next){

// 	var {
// 		username,
// 		password,
// 		email,
// 		avatarLink,
// 		firstname,
// 		lastname,
// 		contactnumber,
// 		description,
// 		available,
// 		day,
// 		m_time,
// 		m_endTime,
// 		a_time,
// 		a_endTime,
// 		n_time,
// 		n_endTime,
// 		address,
// 		lat,
// 		long,
// 		skill
// 	} = req.body;

// 	console.log(username,password);

// 	if(!username || !password){
// 		return res.status(422).json({error: 'Please provide'});
// 	}
// 	User.findOne({username: username}, function(err,existingUser){
// 		if(err) {return next(err);}
// 		if(existingUser) {return res.status(422).json({error: 'taken'});}

// 		var user = new User({
// 			username: username,
// 			email:email,
// 			avatarLink: avatarLink,
// 			password: password,
// 			firstname: firstname,
// 			lastname: lastname,
// 			contactnumber: contactnumber,
// 			description: description,
// 			address: address,
// 			available:available,
// 			schedule: [
// 				{
// 					day: day,
					
// 					morning: {
// 						_time:m_time,
// 						_endTime:m_endTime,
// 					},
// 					afternoon: {
// 						_time:a_time,
// 						_endTime:a_endTime,
// 					},
// 					night: {
// 						_time:n_time,
// 						_endTime:n_endTime,
// 					}
// 				}
// 			],
// 			location: {
// 				latitude:lat,
// 				longitude:long
// 			},
// 			skills: [
// 				{
// 					title:skill
// 				}
// 			]
// 		});

// 		user.save(function(err){
// 			if(err){return next(err)}
// 			res.json({user_id: user._id,token: tokenForUser(user)});
// 		})

// 	})
// }


exports.adminLogin = function(req,res,next){
	let {
		username,
		password
	} = req.body;

	if(!username && !password){
		res.json({type:0})
	}
	if(username && password){
		Admin.countDocuments({username,password},function(err,result){
			if(err){return next(err)}
			res.json({count:result})
		})
	}
}

exports.changeAdmin = function(req,res,next){
	let {

		username,
		oldpass,
		newpass
	} = req.body;

			
			Admin.update({password:oldpass},{$set:{username,password:newpass}},function(err,up){
				if(err){return next(err)}
				res.json({affected:up.n})
			})
		
	

}