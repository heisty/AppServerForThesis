const ITransaction = require('../models/inventoryTransaction');
const Staff = require('../models/staffschema');
const Audit = require('../models/audit');
exports.itransact = function(req,res,next){
	
	let {
		product,
		operation,
		quantity
	} = req.body;


	let dte = new Date();
	let wk;
	let wk_ = dte.getDate()/7;
	console.log(wk_);
	if(wk_<1){
		wk=1;
	}
	if((wk_<2 || wk_===2) && wk_>1){
		wk=2;
	}
	if((wk_<3||wk_===2) && wk_>2){
		wk=3;
	}
	if((wk_<4 && wk_>3)||wk>=4){
		wk=4;
	}




	let itransaction = new ITransaction({
		...req.body,
		week: wk,
		day: dte.getDate(),
		month: dte.getMonth()+1,
		year: dte.getFullYear(),
		hour: dte.getHours(),
		minute: dte.getMinutes(),
	});


		itransaction.save(function(err){
			if(err){return next(err)}
			res.json("Saved");
		})

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
		process: `${operation} ${product}`,
		type: 'Save',
		from: 'Website',
		date: new Date(),
		amount: `${quantity}`,
		sp: `${product}`,
		record: 'Inventory',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
	


}

exports.getTransact = function(req,res,next){
	ITransaction.find({},function(err,itransact){
		if(err){return next(err)}
		res.json({itransact});
	})
}

exports.customerHere = function(req,res,next){
	let {
		_id
	} = req.body;

	Staff.update({'appointment._id':_id},{$set:{'appointment.$.ishere':'true'}},function(err,resx){
		if(err){return next(err)}
		res.json(resx)
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
		process: 'Customer Here Update',
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


exports.getAudit = function(req,res,next){

	Audit.find({},function(err,audit){
		if(err){
			return next(err)
		}
		res.json({audit});
	})
}


exports.getAppX = function(req,res,next){
	let {
		_id
	} = req.body;

	

	Staff.find({_id},{_id:0,appointment:1},function(err,appointments){
		if(err)return next(err)
		res.json(appointments[0])

	})
}