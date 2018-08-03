const AdminReport = require('../models/adminReportSchema');
const Transaction = require('../models/transactionSchema');

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

exports.saveTransaction = function(req,res,next){
	var {
		serviceId,
		date,
		tip
	} = req.body;

	var transaction = new Transaction({
		serviceId: serviceId,
		date: date,
		tip: tip
	});

	transaction.save(function(err){
		if(err){return next(err)}
		return res.json({"Saved":"Green"});
	})
}