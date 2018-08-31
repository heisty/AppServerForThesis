const Staff = require('../models/staffschema');
exports.getScheduledEmployees = function(req,res,next){
	let {
		day,time,suffix
	} = req.body;

	if(suffix==="AM"){
		Staff.find({$and:[{'schedule.day':day},{'available':true},{'schedule.morning._time':{$lte:time}},{'schedule.morning._endTime':{$gt:time}}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="PM"){
		Staff.find({$and:[{'schedule.day':day},{'available':true},{'schedule.afternoon._time':{$lte:time}},{'schedule.afternoon._endTime':{$gt:time}}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="NM"){
		Staff.find({$and:[{'schedule.day':day},{'available':true},{'schedule.night._time':{$lte:time}},{'schedule.night._endTime':{$gt:time}}]},function(err,staff){
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
		Staff.find({$and:[{'schedule.day':day},{$or:[

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

	Staff.find({$and: [{$or:[{'schedule.day':{$ne:day}},{'available':false}]}]},function(err,staff){
		if(err){return next(err)}
		res.json({staff:staff});
	})
}

exports.setAppointment = function(req,res,next){
	let {
		userid,
		username,
		staffid,
		serviceid,
		servicename,
		date,
		status,
		accepted,
		time,
		duration,
		suffix,
		position,
	} = req.body;

	let staff =  new Staff({
		appointment: [
			{
				userid:userid,
				username:username,
				serviceid:serviceid,
				servicename:servicename,
				date:date,
				status:status,
				accepted:accepted,
				time:time,
				duration:duration,
				suffix:suffix,
				position:position
			}
		]
	});

	let staffObj = staff.toObject();
	delete staffObj._id;

	Staff.update({_id:staffid},{$push: staffObj},function(err){
		if(err){return next(err)}
		res.json("Pushed");
	});
}

exports.checkAppointment = function(req,res,next){
	let {

		day,
		time,
		suffix,
	} = req.body;

	Staff.count({$and:[{'appointment.time':{$lte:time}},{'appointment.duration':{$gt:time}},{'appointment.suffix':suffix}]},function(err,found){
		if(err){return next(err)}
		if(!found)res.json({found:0});
		if(found)res.json({found:found});
	})
}


exports.myPositionOnQueue = async function(req,res,next){
	let {

		staffid,
		userid
	} = req.body;
	let timex1;

	try{
	await Staff.findOne({_id:staffid,'appointment.userid':userid},{'appointment.$':1},async function(err,found){
	if(err){return next(err)}
	if(!found)res.json("SHIT");
	timex1=found.appointment[0].time;
	console.log(timex1);
	});

	await Staff.find({_id:staffid},{_id:0,'appointment.time':1},function(err,appointments){
	if(err){return next(err)}
	let data = appointments.map(function(time){
	return {
					time_:time.appointment
			}
	});

				
		
	data_ = (JSON.stringify(data[0].time_)).replace(/[/{}\"time\":]/g, '');
	cleaned = data_.replace(/[\[\]']/g,'');
	let sorted = cleaned.toString().split(',').map(Number).sort(function(a,b){return a-b});
	finaldata=sorted.toString().split(',')
	pos = finaldata.indexOf(timex1.toString())+1;
	res.json({pos});
	});
	
	
	
}
catch(error){
	console.log("ERR",error);
}

	
}

exports.getMyAppointment = function(req,res,next){
	let {
		staffid
	} = req.body;

	Staff.find({_id:staffid},{'_id':0,'appointment':1},function(err,app){
		if(err){return next(err)}
		res.json({appointment:app});
	});

}

