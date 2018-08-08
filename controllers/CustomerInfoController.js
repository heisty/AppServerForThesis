const Customer = require('../models/customerschema');
const ActiveService = require('../models/activeCustomerServices');
const Avail = require('../models/availSchema');

exports.savecustomer = function(req,res,next){
	var {
		userid,
		firstname,
		lastname,
		contact,
		street,
		brgy,
		city
	} = req.body;
	var customer = new Customer({
		firstname: firstname,
		lastname: lastname,
		contact: contact,
		address: [
			{
				street: street,
				brgy: brgy,
				city: city
			}
		]
	});

	var upsertCustomer = customer.toObject();
	delete upsertCustomer._id;
	Customer.update({_id: userid},upsertCustomer,{upsert: true},function(err){
		if(err){ return next(err) }
		return res.json({"Pka":"Code green"});
	});
}

exports.saveCustomerServices = function(req,res,next){
	var {
		userid,
		title,
		chosentype,
		date,
	} = req.body;

	var customer = new Customer({
		services: [
			{
				title: title,
				chosentype: chosentype,
				date: date,
				
			}
		],
	});

	var customerObject = customer.toObject();
	delete customerObject._id;


	Customer.update({_id: userid},{$push: customerObject},function(err){
		if(err) { next(err)}
		return res.json({"Oh":"Yah"});
	});
}

exports.saveCustomerLocation = function(req,res,next){
	var {
		userid,
		latitude,
		longitude
	} = req.body;

	var customer = new Customer({
		location: [
			{
				latitude: latitude,
				longitude: longitude
			}
		]
	});

	var customerLocationObject = customer.toObject();
	delete customerLocationObject._id;

	Customer.update({_id: userid},customerLocationObject,function(err){
		if(err){return next(err)}
		return res.json({"Ok":"Saved"});
	})
}

exports.addcustomerservice = function(req,res,next){
	let {userid,serviceid,servicename,servicetype,staffid,staffname,date,active} = req.body;

	var activeservice = new ActiveService({
		userid: userid,
		serviceid: serviceid,
		servicename: servicename,
		servicetype: servicetype,
		staffid: staffid,
		staffname: staffname,
		date: date,
		
	});

	activeservice.save(function(err){
		if(err){return next(err)}
		res.json("Saved");
	})
	
}
exports.updatecustomerservicestate = function(req,res,next){
	let {userid,title,chosenstaff,date,active} = req.body;

	var customer = new Customer({
		services: [
			{
				title:title,
				chosenstaff:chosenstaff,
				date:date,
				active:active
			}
		]
	});

	var customerObject = customer.toObject();
	delete customerObject._id;

	Customer.update({'services._id':userid},{$set: {'services.$.active':active}},function(err){
		if(err){return next(err)}
		return res.json("Success");
	});
	
}

exports.updateCustomerInfo = function(req,res,next){
	let { userid,firstname,lastname,contact } = req.body;

	let customer = new Customer({
		firstname: firstname,
		lastname: lastname,
		contact: contact,
	});

	let customerObject = customer.toObject();
	delete customerObject._id;

	Customer.update({_id:userid},customerObject,function(err){
		if(err){return next(err)}
		return res.json("Updated");
	})

}

exports.returnActiveCustomerServices = function(req,res,next){
	var {userid} = req.body;


	ActiveService.find({userid:userid},function(err,services){
		if(err){return next(err)}
		res.json({services});
	})

	// Customer.where(('services.active'.e(true)),function(err,services){
	// 	if(err){return next(err)}
	// 	if(!services){return res.json("No active")}
	// 	res.json(services.services);
	// });
}

exports.countActive = function(req,res,next){
	Avail.count({servicetype:"salon"},function(err,count){
		if(err){return next(err)}
		return res.json({count});
	})
}
exports.positionActive = function(req,res,next){
	let {userid} = req.body;

	Avail.findOne({userid:userid},{'position':1,'_id':0},{lean: true},function(err,active){
		if(err){return next(err)}
		
		return res.json(active);
	})
}

exports.getRecords = function(req,res,next){
	ActiveService.find({},function(err,records){
		if(err){ return next(err)}
		res.json({records:records});
	})
}