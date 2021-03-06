const Customer = require('../models/customerschema');
const ActiveService = require('../models/activeCustomerServices');
const Avail = require('../models/availSchema');
const Address = require('../models/CustomerAddress');
const bcrypt = require('bcrypt-nodejs');
const Audit = require('../models/audit');

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

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: username,
		process: 'Save Customer Details',
		type: 'Update',
		from: 'Website',
		date: new Date(),
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
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

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: userid,
		process: 'Save Customer Services',
		type: 'Input',
		from: 'Application',
		date: new Date(),
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
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
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: userid,
		process: 'Save Customer Location',
		type: 'Input',
		from: 'Website',
		date: new Date(),
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}

exports.addcustomerservice = function(req,res,next){
	let {userid,username,serviceid,servicename,servicetype,staffid,staffname,date,active} = req.body;

	var activeservice = new ActiveService({
		userid: userid,
		username: username,
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
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: userid,
		process: 'Add Customer Services',
		type: 'Input',
		from: 'Application',
		date: new Date(),
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
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

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: 'ADMIN',
		process: 'C STATE',
		type: 'Update',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: 'N/A',
		record: 'Services Profile',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
	
}

exports.updateCustomerInfo = function(req,res,next){
	let { userid,firstname,lastname,email,contact,street,brgy,munc,city,lat,long } = req.body;



	console.log(userid,firstname);

	let customer = new Customer({
		firstname: firstname,
		lastname: lastname,
		email: email,
		contact: contact,
		street: street,
		brgy: brgy,
		munc: munc,
		city: city,
		lat: lat,
		long: long

	});

	let customerObject = customer.toObject();
	delete customerObject._id;

	Customer.update({_id:userid},customerObject,function(err){
		if(err){return next(err)}
		return res.json("Updated");
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: 'ADMIN',
		process: 'CI Update',
		type: 'Update',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: 'N/A',
		record: 'Customer Profile',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})

}

exports.updateCustomerAddress = function(req,res,next){
	let {userid,street,brgy,munc,city,latitude,longitude} = req.body;

	let address = new Address({
		userid: userid,
		street: street,
		brgy: brgy,
		munc: munc,
		city: city,
		latitude: latitude,
		longitude: longitude,
	});

	let upAddress = new Address({
		street: street,
		brgy: brgy,
		city: city,
		munc: munc,
		latitude: latitude,
		longitude: longitude,
	});

	Address.findOne({userid: userid},function(err,existing){
		if(err){ return next(err)}
		if(!existing){
			address.save(function(err){
				if(err){return next(err)}
				res.json("Success");
			})
		}
		if(existing){
		let upAddr = upAddress.toObject();
		delete upAddr._id;

		Address.update({userid:userid},upAddr,function(err){
			if(err){return next(err)}
			res.json("Updated");
		})
		}
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: 'ADMIN',
		process: 'CA Update',
		type: 'Update',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: 'N/A',
		record: 'Customer Profile',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}

exports.returnActiveCustomerServices = function(req,res,next){
	var {userid} = req.body;


	Avail.find({userid:userid},function(err,services){
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
	var {staffid} = req.body;
	Avail.count({servicetype:"salon",staffid:staffid},function(err,count){
		if(err){return next(err)}
		return res.json({count});
	})
}
exports.getActiveStaffId = function(req,res,next){
	var {userid} = req.body;
	Avail.findOne({userid:userid},{'staffid':1,_id:0},{lean:true},function(err,staffid){
		if(err){return next(err)}
		res.json(staffid);
	})
}
exports.positionActive = function(req,res,next){
	let {userid,staffid} = req.body;

	Avail.findOne({userid:userid},{'position':1,'_id':0},{lean: true},function(err,active){
		if(err){return next(err)}
		
		return res.json(active);
	})
}

exports.getRecords = function(req,res,next){
	ActiveService.find({},function(err,records){
		if(err){ return next(err)}
		res.json({records});
	})
}

exports.getCustomerInfo = async function(req,res,next){
	let {
		userid
	} = req.body;
	await Customer.find({_id:userid},function(err,userinfo){
		if(err){return next(err)}
		try{
		res.json({userinfo:userinfo});
			}
			catch(error){return next(err)}
	})
}

exports.getCustomerList = function(req,res,next){
	Customer.find({},function(err,customers){
		if(err){return next(err)}
		try{
		res.json({customers});
	}
	catch(error){return next(err)}
	})
}

exports.updateCustomerProfile = async function(req,res,next){
	let {
		userid,username,password,firstname,lastname,email,contact,street,brgy,munc,city
	} = req.body;

	await bcrypt.genSalt(10, function(err,salt){
		if(err){ return next(err)}
		bcrypt.hash(password,salt,null,function(err,hash){
			if(err) {return next(err)}
			password=hash;
			
		});

	});

	let customer = new Customer({
		username,password,firstname,lastname,email,contact,street,brgy,munc,city
	});

	let customerObject = customer.toObject();

	



	delete customerObject._id;

	Customer.update({_id:userid},customerObject,function(err){
		if(err){console.log(err,userid,password,firstname,lastname,email,contact);return next(err)}
		res.json("Updated");
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: 'ADMIN',
		process: 'CP Update',
		type: 'Update',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: 'N/A',
		record: 'Customer Profile',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}

exports.existingUser = function(req,res,next){
	let {
		contact
	} = req.body;

	Customer.countDocuments({contact},function(err,count){
		if(err){return next(err)}
		res.json({count});
	})
}
