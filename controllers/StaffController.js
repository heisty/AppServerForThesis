const Avail = require('../models/availSchema');
const Transaction = require('../models/activeCustomerServices');
const Staff = require('../models/staffschema');
const Admin = require('../models/adminSchema');

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
		skills: [
			{
				title: skill
			}
		]
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

exports.updateStaffProfile = function(req,res,next){
	let {
		staffid,
		username,
		email,
		password,
		avatarLink,
		firstname,
		lastname,
		contactnumber,
		description,
		address,
		longitude,
		latitude,
		title,
	} = req.body;

	let staff = new Staff({
		username:username,
		email:email,
		password:password,
		avatarLink:avatarLink,
		firstname:firstname,
		lastname:lastname,
		contactnumber:contactnumber,
		description:description,
		address:address,
		longitude:longitude,
		latitude:latitude,
		title:title
	});

	let staffObject = staff.toObject();
	delete staffObject._id;

	Staff.update({_id:staffid},staffObject,function(err){
		if(err){return next(err)}
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
