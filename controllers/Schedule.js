const Staff = require('../models/staffschema');
exports.getScheduledEmployees = function(req,res,next){
	let {
		day,time,suffix
	} = req.body;

	if(suffix==="AM"){
		Staff.find({$and:[{'schedule.day':day},{'available':true},{'schedule.morning._time':{$lte:time}},{'schedule.morning._endTime':{$gte:time}}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="PM"){
		Staff.find({$and:[{'schedule.day':day},{'available':true},{'schedule.afternoon._time':{$lte:time}},{'schedule.afternoon._endTime':{$gte:time}}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="NM"){
		Staff.find({$and:[{'schedule.day':day},{'available':true},{'schedule.night._time':{$lte:time}},{'schedule.night._endTime':{$gte:time}}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}
	
}

exports.getLaterScheduled = function(req,res,next){
	let {
		day,time,suffix
	} = req.body;

	if(suffix==="AM"){
		Staff.find({$and:[{$or:[

			{'schedule.morning._time':{$gte:time}},{'schedule.morning._endTime':{$lte:time}}]}

			,{'available':true}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="PM"){
		Staff.find({$and:[{$or:[

			{'schedule.afternoon._time':{$gte:time}},{'schedule.afternoon._endTime':{$lte:time}}]}

			,{'available':true}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="NM"){
		Staff.find({$and:[{$or:[

			{'schedule.night._time':{$gte:time}},{'schedule.night._endTime':{$lte:time}}]}

			,{'available':true}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	
}

exports.getNeverAvailable = function(req,res,next){
	let {
		day,time,suffix
	} = req.body;

	Staff.find({$and: [{'available':false}]},function(err,staff){
		if(err){return next(err)}
		res.json({staff:staff});
	})
}