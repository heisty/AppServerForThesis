const Avail = require('../models/availSchema');
const Transaction = require('../models/activeCustomerServices');
const Staff = require('../models/staffschema');
const Admin = require('../models/adminSchema');
const Order = require('../models/Orders');
const bcrypt = require('bcrypt-nodejs');

exports.getAppointment = function(req,res,next){
	var {staffid} = req.body;
	console.log(staffid);
	Avail.find({staffid: staffid},function(err,appointment){
		if(err){ return next(err)}
		if(!appointment){ return res.json("No Appointment"); }
		res.json({appointment:appointment});
	})
}
exports.addSkills = function(req,res,next){
	var {staffid,skill} = req.body;

	var staff = new Staff({
		skills:skill
	});

	var staffObject = staff.toObject();
	delete staffObject._id;

	Staff.update({_id:staffid},{$push: staffObject},function(err,updated){
		if(err){next(err)}
		if(updated){return res.json("Success")}
	});
}
exports.deleteActiveAvail = function(req,res,next){
	let { availid } = req.body;
	Avail.deleteOne({_id:availid},function(err,deleted){
		if(err){return next(err)}
		if(!deleted){return res.json("NOT DELETED")}
		res.json("Deleted");
	})
}

exports.getStaffTransaction = function(req,res,next){
	let {staffid} = req.body;

	Transaction.find({staffid: staffid},function(err,transaction){
		if(err){return next(err)}
		if(!transaction){ return res.json("No Transaction") }
		res.json({transaction:transaction});
	})
}

exports.retrieveStaffProfile = function(req,res,next){
	let {staffid} = req.body;

	Staff.find({_id:staffid},function(err,staff){
		if(err){return next(err)}
		if(!staff){ return res.json("No Profile") }
		res.json({staff});
	})
}

exports.updateStaffProfile = async function(req,res,next){
	let {
		staffid,username,password,firstname,lastname,email,contact,address,skills
	} = req.body;

	await bcrypt.genSalt(10, function(err,salt){
		if(err){ return next(err)}
		bcrypt.hash(password,salt,null,function(err,hash){
			if(err) {return next(err)}
			password=hash;
			
		});

	});

	// let staff = new Staff({
	// 	staffid,username,password,firstname,lastname,email,contact,address,skills
	// });

	// let staffObject = staff.toObject();

	let stObj = {staffid,username,password,firstname,lastname,email,contact,address,skills}

	Staff.update({_id:staffid},{$set: stObj},function(err){
		if(err){console.log(err);return next(err)}
		res.json("Updated");
	})
}



exports.loginAdmin = function(req,res,next){
	let {username,password} = req.body;

	Admin.findOne({username:username,password:password},function(err,success){
		if(err){return next(err)}
		res.json(success);
	})
}

exports.signupAdmin = function(req,res,next){
	let {username,password} = req.body;

	let admin = new Admin({
		username: username,
		password: password
	});

	admin.save(function(err){
		if(err){return next(err)}
		res.json("Success");
	})
}

exports.customerQueue = function(req,res,next){
	let {position} = req.body;
	Avail.update({servicetype:'salon',position: {$gt: position}},{$inc:{position: -1}},{multi: true},function(err,next){
		if(err){return next(err)}
		res.json("Updated");
	})
}

exports.orderService = function(req,res,next){
	let {
		userid,
		serviceid,
		servicename,
		staffid,
		staffname,
		scheduledate,
		scheduletime,
		orderstatus,
		orderaccepted,
	} = req.body;

	var order = new Order({
		userid: userid,
		serviceid: serviceid,
		servicename:servicename,
		staffid:staffid,
		staffname:staffname,
		scheduledate:scheduledate,
		scheduletime:scheduletime,
		orderstatus:orderstatus,
		orderaccepted:orderaccepted,

	});

	order.save(function(err){
		if(err){return next(err)}
		res.json("Saved");
	})
}

exports.deleteEmployee = function(req,res,next){
	let {
		staffid
	} = req.body;

	Staff.deleteOne({_id:staffid},function(err){
		if(err){return next(err)}
		res.json("ok")
	});
}    