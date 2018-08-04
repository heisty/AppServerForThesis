const Customer = require('../models/customerschema');

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
		active
	} = req.body;

	var customer = new Customer({
		services: [
			{
				title: title,
				chosentype: chosentype,
				date: date,
				active: active
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

	Customer.update({_id:userid},{$push: customerObject},function(err){
		if(err){return next(err)}
		return res.json(customer);
	});
	
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

exports.returnActiveCustomerServices = function(req,res,next){
	var {userid} = req.body;
	Customer.find({_id:userid and 'services.active':true},function(err,services){
		if(err){return next(err)}
		if(!services){return res.json("No active")}
		res.json(services);
	});
}