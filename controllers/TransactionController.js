const AdminReport = require('../models/adminReportSchema');
const Transaction = require('../models/availSchema');
const Customer = require('../models/customerschema');
const Staff = require('../models/staffschema');
const Service = require('../models/serviceSchema');

exports.saveAdminReport = function(req,res,next){
	var {
		staffid,
		transactionid,
	} = req.body;

	var adminreport = new AdminReport({
		staffid: staffid,
		transactionid: transactionid,
	});

	adminreport.save(function(err){
		if(err){return next(err)}
		return res.json({"Saved":"Yahoo"});
	});
}

exports.saveTransaction = async function(req,res,next){
	var {
		userid,
		staffid,
		serviceid,
		date,
		time,
		servicetype,

	} = req.body;

	if(!servicetype)servicetype="Salon";

	let username,userfirstname,userlastname,staffusername,stafffirstname,
	stafflastname,servicename,serviceprice,duration,counter;

	try{
	await Transaction.countDocuments({userid:userid,paid:false},function(err,counted){
		if(err){return next(err)}
		counter=counted;
	});

	await Customer.findOne({_id:userid},function(err,user){
		if(err){return next(err)}
		username=user.username;
		userfirstname=user.firstname;
		userlastname=user.lastname;
		
	});

	await Staff.findOne({_id:staffid},function(err,staff){
		if(err){return next(err)}
		staffusername=staff.username;
		stafffirstname=staff.firstname;
		stafflastname=staff.lastname;
	});

	await Service.findOne({_id:serviceid},function(err,service){
		if(err){return next(err)}
		servicename=service.title;
		serviceprice=service.price;
		duration=service.duration;
	});

	

	if(counter===0){

	let transaction = new Transaction({
			userid,
			username,
			userfirstname,
			userlastname,

			staffid,
			staffusername,
			stafffirstname,
			stafflastname,

			service: [

				{
					serviceid,
					servicename,
					servicetype,
					serviceprice,
					date,
					time,
					duration,
				}

			],
			paid: false,
			remit:false,
			total:serviceprice
	});

	transaction.save(function(err){
		if(err){return next(err)}
		res.json("Saved");
	});

	

}
else{

	let transaction = new Transaction({
		service: [

				{
					serviceid,
					servicename,
					servicetype,
					serviceprice,
					date,
					time,
					duration,
				}

			],
			
	});

	let tObj = transaction.toObject();
	delete tObj._id;

	Transaction.update({userid:userid},{$push:tObj,$inc: {total:serviceprice}},function(err,success){
		if(err){return next(err)}
		res.json("Pushed")
	})

	
}
}
catch(error){
	console.log(error);
}
	
}


exports.getALL = function(req,res,next){
	// Staff.find({'appointment.accepted':true},{_id:0,appointment:1},function(err,appx){
	// 	if(err){return next(err)}
	// 	res.json(appx);
	// })

	Staff.aggregate([

	{
		$unwind: '$appointment'
	},

	{
		$match: {
			'appointment.accepted':'true'
		}
	},
	{
		$project: {
			
			_id:0,
			'appointment':1
		}
	}

		],function(err,app){

			if(err){return next(err)}
			res.json({app})

	})
}


exports.notified = function(req,res,next){

	Staff.update({},{'appointment':{$set:{notified1:true}}},{multi:true},function(err){
		if(err){return next(err)}
		res.json("success");
	})
}


exports.setDevice = function(req,res,next){
	let {
		type,
		_id,
		deviceid
	} = req.body;

	if(type==="staff"){
		Staff.update({_id},{$set:{deviceid}},function(err){
			if(err){return next(err)}
			res.json('ok');
		})
	}
	if(type==="customer"){
		Customer.update({_id},{$set:{deviceid}},function(err){
			if(err){return next(err)}
			res.json('ok')
		})
	}
}

exports.getCustDevice = function(req,res,next){
	let {
		_id,
		type
	} = req.body;

	if(type==="staff"){
		Staff.find({_id},{_id:0,deviceid:1},function(err,deviceid){
		if(err){return next(err)}
		res.json({deviceid:deviceid[0].deviceid});
	})
	}
	if(type==="customer"){
		Customer.find({_id},{_id:0,deviceid:1},function(err,deviceid){
		if(err){return next(err)}
		try{
		res.json({deviceid:deviceid[0].deviceid});
			}
			catch(error){}
	})
	}
}

exports.getStats = async function(req,res,next){

	let c=0;
	let pushX = [];
	let dat=[];
	await Staff.find({},async function(err,staff){
		if(err){return next(err)}
		await staff.map(async function(entry){
			await dat.push({"staffid":entry._id});
		})

		
	})

	await dat.map(async function(entry){
	 	await Transaction.countDocuments({staffid:entry.staffid},async function(err,sc){
	 		if(err){return next(err)}
	 		await pushX.push(sc);
	 	})
	 	
	});

	res.json(pushX)

	





}
