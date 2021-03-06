const Staff = require('../models/staffschema');
const Transaction = require('../models/transactionSchema');
const Customer = require('../models/customerschema');
const Service = require('../models/serviceSchema');
const moment = require('moment-timezone');
const Audit = require('../models/audit');
exports.getScheduledEmployees = function(req,res,next){


	let {
		day,time,suffix,skill
	} = req.body;

	


	if(suffix==="AM"){
		Staff.find({$and:[{'skills':{$elemMatch:{"label":skill}}},{'schedule.day':day},{'available':true},{'schedule.morning._time':{$lte:time}},{'schedule.morning._endTime':{$gt:time}}]},function(err,staff){
		if(err){return next(err)}
		
		return res.json({staff:staff});
	});
	}

	if(suffix==="PM"){
		Staff.find({$and:[{'skills.label':skill},{'schedule.day':day},{'available':true},{'schedule.afternoon._time':{$lte:time}},{'schedule.afternoon._endTime':{$gt:time}}]},function(err,staff){
		if(err){return next(err)}
		
		return res.json({staff:staff});
	});
	}

	if(suffix==="NM"){
		Staff.find({$and:[{'skills.label':skill},{'schedule.day':day},{'available':true},{'schedule.night._time':{$lte:time}},{'schedule.night._endTime':{$gt:time}}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}
	
}

exports.getLaterScheduled = function(req,res,next){
	let {
		day,time,suffix,skill
	} = req.body;

	if(suffix==="AM"){
		Staff.find({$and:[{'skills.label':skill},{'schedule.day':day},{$or:[

			{'schedule.morning._time':{$gte:time}},{'schedule.morning._endTime':{$lte:time}}]}

			,{'available':true}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="PM"){
		Staff.find({$and:[{'skills.label':skill},{$or:[

			{'schedule.afternoon._time':{$gte:time}},{'schedule.afternoon._endTime':{$lte:time}}]}

			,{'available':true}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	if(suffix==="NM"){
		Staff.find({$and:[{'skills.label':skill},{$or:[

			{'schedule.night._time':{$gte:time}},{'schedule.night._endTime':{$lte:time}}]}

			,{'available':true}]},function(err,staff){
		if(err){return next(err)}
		return res.json({staff:staff});
	});
	}

	
}

exports.getNeverAvailable = function(req,res,next){
	let {
		day,time,suffix,skill
	} = req.body;

	Staff.find({$and: [{'skills.label':skill},{$or:[{'schedule.day':{$ne:day}},{'available':false}]}]},function(err,staff){
		if(err){return next(err)}
		res.json({staff:staff});
	})
}

exports.setAppointment = function(req,res,next){
	let {
		userid,
		customer,
		serviceid,
		servicename,
		servicetype,
		staffid,
		staffname,
		date,
		status,
		accepted,
		time,
		price,
		duration,
		suffix,
		latitude,
		longitude,
		deviceid
		
	} = req.body;

	let sorting = duration;

	if(suffix==="PM"){
		sorting+=1000;
	}

	let date1 = new Date(date);
	let m = date1.getMonth()+1;
	if(m<10)m=`0${m}`;
	let d = date1.getDate();
	if(d<10)d=`0${d}`;
	let y = date1.getFullYear();

	let date_ = `${y}-${m}-${d}`;

	let staff =  new Staff({
		appointment: [
			{
				userid:userid,
				customer:customer,
				serviceid:serviceid,
				servicename:servicename,
				servicetype:servicetype,
				staffid:staffid,
				staffname:staffname,
				date:date_,
				status:"pending",
				accepted:false,
				time:time,
				price:price,
				duration:duration,
				suffix:suffix,
				latitude,
				longitude,
				deviceid:deviceid?deviceid:0,
				notified1:"false",
				notified2:"false",
				ishere:false,
				sorting,
				
			}
		]
	});

	let staffObj = staff.toObject();
	delete staffObj._id;

	Staff.update({_id:staffid},{$push: staffObj},function(err){
		if(err){return next(err)}
		res.json("Pushed");
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let yy  = IPs.split(",")[0];




	let audit = new Audit({
		user: 'ADMIN',
		process: `${customer} appointed ${staffname}`,
		type: 'Appointment',
		from: 'Website',
		date: new Date(),
		amount: `${price}`,
		sp: `${servicename}`,
		record: 'Appointment Log',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}

exports.checkAppointment = function(req,res,next){
	let {

		staffid,
		date,
		time,
		suffix,
	} = req.body;

	

	Staff.count({$and:[{_id:staffid,'appointment.date':date,'appointment.time':{$lte:time}},{'appointment.duration':{$gt:time}},{'appointment.suffix':suffix}]},function(err,found){
		if(err){return next(err)}
		
		res.json({found});
	})
}


exports.myPositionOnQueue = async function(req,res,next){
	let {

		
		userid
	} = req.body;
	let timex1;
	let staffid;

	try{


	await Staff.findOne({'appointment.userid':userid},function(err,staff){
		if(err){return next(err)}
		try{
		staffid=staff._id;
		}
		catch(error){
			// console.log("NO ID");
			// staffid=null
		}

	})

	await Staff.findOne({_id:staffid,'appointment.userid':userid,'appointment.accepted':'true'},{'appointment.$':1},async function(err,found){
	if(err){return next(err)}
	try{
	
	timex1=found.appointment[0].time;
	
	}
	catch(error){
		// console.log("NO FOUND TIMEZ")
		// timex1=null
	}
	});



	await Staff.aggregate([
			{$unwind: '$appointment'},
			{$match: {'appointment.accepted':{$eq:'true'}}},
			{$project: {_id:0,'appointment.time':1}}
		],function(err,resulte){

		try{
			if(err){return next(err)}
			//res.json(resulte);


				let time= [];
				let data = [];

				resulte.forEach(function(entry){
					time.push(entry.appointment);
				})
				let pushit = {
					time_:time
				}
				data.push(pushit);

		


	 	let data_n = data[0].time_.length;
	 	
	// data.forEach(function(entry){
	// 	data_n=entry.time_
	// })		
	
			data_ = (JSON.stringify(data[0].time_)).replace(/[/{}\"time\":]/g, '');
			cleaned = data_.replace(/[\[\]']/g,'');
			let sorted = cleaned.toString().split(',').map(Number).sort(function(a,b){return a-b});
			finaldata=sorted.toString().split(',')
			pos = finaldata.indexOf(timex1.toString())+1;
			res.json({pos,data_n,data});
			
	
		}
		catch(error){}


		//res.json('ok')
		//res.json({pos:'?',data_n:'?',data:'?'});

		})

//BACK SAGE++
// 	await Staff.find({_id:staffid,"appointment.accepted":"true"},{'_id':0,'appointment.time':1},async function(err,appointments){
// 	if(err){return next(err)}

// 	try{

// 	let data = appointments.map(function(time){
// 	return {
// 					time_:time.appointment
// 			}
// 	});

// 	// let data = [];
// 	// let xd = await appointments.map(function(time){
// 	// 	let yz = {
// 	// 		time_:time.appointment.time
// 	// 	}

// 	// 	time.appointment.map(function(item){
// 	// 		if(item.accepted==="true"){
// 	// 			return {
// 	// 				time_:item.time
// 	// 			}
// 	// 		}
// 	// 	})
		
		
// 	// });


// 	 //res.json(data);

// 	let data_n = data[0].time_.length;
// 	// data.forEach(function(entry){
// 	// 	data_n=entry.time_
// 	// })		
	
// 	data_ = (JSON.stringify(data[0].time_)).replace(/[/{}\"time\":]/g, '');
// 	cleaned = data_.replace(/[\[\]']/g,'');
// 	let sorted = cleaned.toString().split(',').map(Number).sort(function(a,b){return a-b});
// 	finaldata=sorted.toString().split(',')
// 	pos = finaldata.indexOf(timex1.toString())+1;
// 	//res.json({pos,data_n,data});
// 	res.json({data_n,data});
// }
// catch(error){}


// 	});
	
	
	
}
catch(error){
	//console.log("ERR",error);
	//res.json("F")

}

	
}

exports.getMyAppointment = async function(req,res,next){
	let {
		staffid
	} = req.body;

	let appointment = [];

	Staff.find({_id:staffid},{'_id':0,'appointment':1},function(err,appointment){
		if(err){return next(err)}
		res.json({appointment});
	});

	// await Staff.find({_id:staffid},async function(err,app){
	// 	if(err){return next(err)}
	// 	await app.appointement.forEach(function(entry){
	// 		if(entry.accepted===true){
	// 			appointment.push(entry);
	// 			console.log(entry);
	// 		}
	// 	})

	// })

	



}




exports.setSchedule = async function(req,res,next){
	let {
		_id,
		mode,
		whole,
		day,
	} = req.body;

	let {

		sday,
		ams,
		ame,
		pms,
		pme,


	} = req.body;


	let stObj = [

		{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Monday"

				},
				{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Tuesday"

				},
				{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Wednesday"

				},
				{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Thursday"

				},
				{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Friday"

				},
				{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Saturday"

				},
				{
					morning: {
						_time:ams,
						_endTime:ame,
					},
					afternoon: {
						_time:pms,
						_endTime:pme,
					},
					day:"Sunday"

				}

	]


	// let staff = new Staff({
	// 		schedule: [

	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Monday"

	// 			},
	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Tuesday"

	// 			},
	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Wednesday"

	// 			},
	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Thursday"

	// 			},
	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Friday"

	// 			},
	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Saturday"

	// 			},
	// 			{
	// 				morning: {
	// 					_time:ams,
	// 					_endTime:ame,
	// 				},
	// 				afternoon: {
	// 					_time:pms,
	// 					_endTime:pme,
	// 				},
	// 				day:"Sunday"

	// 			}

	// 		]
	// 	});

	// let staffObj  = staff.toObject();
	// delete staffObj._id;

	

	//res.json(isUpdate);


	if(mode==="all" && whole==="emp"){
	

		
		

		Staff.update({},{$set: {schedule:stObj}},{multi:true},function(err){
			if(err){return next(err)}
			
		})
		

	}

	if(mode==="manual" && whole==="emp"){

		

		//delete the day for all

		// Staff.update({schedule},{$pull: {'staffs.schedule.$.day':sday}},function(err){

		// 	if(err){return next(err)}
		// 	console.log("DONE DONE");

		// })

		// let sched = new Staff({

		// 	schedule: [
		// 		{
		// 			morning: {

		// 				_time:ams,
		// 				_endTime:ame

		// 			},
		// 			afternoon: {
		// 				_time:pms,
		// 				_endTime:pme
		// 			},
		// 			day:sday
		// 		}
		// 	]

		// });

		// let schedObj = sched.toObject();
		// delete schedObj._id;


		let stObj1 = [
				{
					morning: {

						_time:ams,
						_endTime:ame

					},
					afternoon: {
						_time:pms,
						_endTime:pme
					},
					day:sday
				}
			]

		

		Staff.update({},{$pull: {'schedule':{'day':sday}}},{multi:true},function(err,sched){
			if(err){return next(err)}	
		});

		await Staff.update({},{$addToSet: {schedule:stObj1}},{multi:true},function(err){
			if(err){return next(err)}
			res.json("ok");
		});

		


	}

	if(mode==="all" && whole==="manual"){
	

		Staff.update({_id},{$set: {schedule:stObj}},{multi:true},function(err){
			if(err){return next(err)}
		
		})



	}

	if(mode==="manual" && whole==="manual"){

	

		Staff.update({_id},{$pull: {'schedule':{'day':sday}}},function(err,sched){
			if(err){return next(err)}	
			
		});

		// let schedmanual = new Staff({
		// 	schedule:
		// });

		// let smObj = schedmanual.toObject();
		// delete smObj._id;

		let stObj3 =  [
				{
					morning: {

						_time:ams,
						_endTime:ame

					},
					afternoon: {
						_time:pms,
						_endTime:pme
					},
					day:sday
				}
			]


		await Staff.update({_id},{$addToSet: {schedule:stObj3}},function(err){
			if(err){return  next(err)}
			res.json("ok");
		}) 

	}

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
		process: 'Set Schedule',
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


exports.resetSchedule = function(req,res,next){


	let stObj4 = []
	

	Staff.update({},{$set:{schedule:stObj4}},{multi:true},function(err){
		if(err){return next(err)}
		res.json("ok");
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
		process: 'Reset Schedule',
		type: 'Reset',
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


exports.cancelOrder = function(req,res,next){
	let {
		staffid,
		appid
	} = req.body;

	Staff.update({_id:staffid},{$pull: {'appointment':{'_id':appid}}},function(err){
		if(err){return next(err)}
		res.json("ok");
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
		user: `AppID ${appid}`,
		process: 'Cancel Order',
		type: 'Update',
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

exports.updateOrder = function(req,res,next){
	let {
		staffid,
		appid,
		time,
		suffix,
		date
	} = req.body;

	Staff.update({_id:staffid,'appointment.0._id':appid},{$set: {'appointment.0.time':time,'appointment.0.suffix':suffix,'appointment.0.date':date}},function(err){
		if(err){return next(err)}
		res.json("ok");
	})

	// let sched = new Staff({
	// 	time,
	// 	suffix
	// })

	// let sObj = sched.toObject();
	// delete sObj._id;

	// Staff.update({_id:staffid,'appointment._id':appid},sObj,function(err){
	// 	if(err){return next(err)}
	// 	res.json("done");
	// })

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];




	let audit = new Audit({
		user: `AppID ${appid}`,
		process: 'Update Order',
		type: 'Access',
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


exports.acceptAp = function(req,res,next) {
	let {

		staffid,
		appid,

	} = req.body;

	;

	Staff.update({_id:staffid,'appointment._id':appid},{$set: {'appointment.$.accepted':'true'}},function(err){
		if(err){return next(err)}
		res.json("accepted");
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
		process: 'Accepted Appointment',
		type: 'Appointment',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: `APPID ${appid}`,
		record: 'Appointment Log',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}

exports.rejectAp = function(req,res,next) {
	let {

		staffid,
		appid,

	} = req.body;

	

	Staff.update({_id:staffid},{$pull:{'appointment':{'_id':appid}}},function(err){
		if(err){return next(err)}
		res.json("deleted");
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
		process: 'Reject Appointment',
		type: 'Delete',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: `APPID ${appid}`,
		record: 'Appointment Log',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}



exports.setCompleteAp = async function(req,res,next){


	// I DELETED THE ZERO () in query beware

	let {
		staffid,
		appid,tendered,change
	} = req.body;
	

	let dte = new Date();
	let wk;
	let wk_ = dte.getDate()/7;

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


	let transaction = new Transaction({

		...req.body,
		rating: 0,
		week: wk,
		day: dte.getDate(),
		month: dte.getMonth()+1,
		year: dte.getFullYear(),
		tendered:0,
		change:0

	
	});

	await transaction.save(function(err){
		if(err){return next(err)}
	
	})

	Staff.update({_id:staffid},{$pull:{'appointment':{'_id':appid}}},function(err){
		if(err){return next(err)}
		res.json('ok')
	});

	var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
	

	let y  = IPs.split(",")[0];

	let {
		customer,service,staff,price
	} = req.body;



	let audit = new Audit({
		user: 'ADMIN',
		process: 'Completed Appointment',
		type: 'Complete',
		from: 'Website',
		date: new Date(),
		amount: 'N/A',
		sp: `${service}`,
		record: 'Appointment Log',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})


	
}



exports.inSalon = function(req,res,next){


	let dte = new Date();
	let wk;
	let wk_ = dte.getDate()/7;

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

	let {
		service,
		customer,
		price
	} = req.body;

	let transaction = new Transaction({
		...req.body,
		rating: 0,
		week: wk,
		day: dte.getDate(),
		month: dte.getMonth()+1,
		year: dte.getFullYear()
	})


	transaction.save(function(err){
		if(err){return next(err)}
		res.json("ok");
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
		process: `${customer} Paid ${service}`,
		type: 'Payment',
		from: 'Website',
		date: new Date(),
		amount: `${price}`,
		sp: `${service}`,
		record: 'Payment Record',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
}


// get specific recent appointments for customer

exports.getCustRecent = async function(req,res,next){
	let {userid} = req.body;

	await Transaction.find({userid},function(err,staff){
		if(err){return next(err)}
		
		res.json({staff});
	})
}

exports.getStaffRecent = function(req,res,next){
	let {staffid} = req.body;

	Transaction.find({staffid:staffid},function(err,staff){
		if(err){return next(err)}
		
		res.json({staff});

	})
}

exports.getAllTransaction = function(req,res,next){
	let {userid} = req.body;

	Transaction.find({},function(err,staff){
		if(err){return next(err)}
		res.json({staff});
	})
}


exports.numberOfCustomers = async function(req,res,next){
	let {
		date,
		staffid,
	} = req.body;

	let earnings=0;
	let custnum=0;

	// console.log("INI",moment.tz(date,'Asia/Manila').toDate());
	// console.log("END",date);
	let date1 = new Date(date);
	let m = date1.getMonth()+1;
	if(m<10)m=`0${m}`;
	let d = date1.getDate();
	if(d<10)d=`0${d}`;
	let y = date1.getFullYear();

	let date_ = `${y}-${m}-${d}`;

	let dataret = new Date(date_);


	// Transaction.find({staffid},{_id:0,date:1},function(err,datee){
	// 	if(err){return next(err)}
	// 	res.json(datee);
	// })


	await Transaction.countDocuments({staffid,date:dataret,status:'completed'},async function(err,custNum){
		if(err){return next(err)}
		custnum=custNum;

		await Transaction.aggregate([
				{
					$match: {
						staffid,
						status: 'completed',
						
					}
				}
			],function(err,weekly){
				
			})

		await Transaction.aggregate([

		{$match: 
			{
				staffid,
				status:'completed',
				date: dataret,
			}
		},
   		{
     		$group: {
     		_id:null,	
       		price: { $sum: '$price'},
    	 }
   		}
	],function(err,counter){
		if(err){return next(err)}
		counter.map(function(item){
			earnings=item.price;
			
		})
		res.json({custnum,earnings})
	})
	})

	

	



}

exports.rating = async function(req,res,next){
	let {
		staffid
	} = req.body;

	let custRated;
	let rating;

	await Transaction.aggregate([

		{
		$match: {
			staffid,
			status:'completed',
			rating: {$gte: 0}
		}
		},
		{$count: 'count'}

		],async function(err,count){
		if(err){return next(err)}
		count.map(function(it){
			custRated=it.count
		})
		
		await Transaction.aggregate([
	{
		$match: {
			staffid,
			status:'completed',
			rating: {$gte: 0}
		}
	},
	{
		$group: {
			_id:null,
			ratingPercentage: {$sum: '$rating'}
		}
	}],function(err,ratingPercentage){
		if(err){return next(err)}
		ratingPercentage.map(function(item){
			rating=(item.ratingPercentage)/custRated;
			
			res.json({custRated,rating});
		})
	})

	

	});

	



}



exports.getAllSchedule = async function(req,res,next){
	let {
		day,
		time,
		suffix,
		skill
	} = req.body;





}

exports.isTaken =  function(req,res,next){
	let {
		staffid,time,suffix,date
	} = req.body;

	
	time=parseInt(time);
	let dx = new Date(date);
	let day = dx.getDay();
	
	let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

	day=days[day];
	let count=0;

	let date1 = new Date(dx);
	let m = date1.getMonth()+1;
	if(m<10)m=`0${m}`;
	let d = date1.getDate();
	if(d<10)d=`0${d}`;
	let y = date1.getFullYear();

	let date_ = `${y}-${m}-${d}`;

	let k = new Date(date_)
	time+=5;



	

	Staff.aggregate([

			{
				$unwind: '$appointment'
			},
			{
				$match: {
					'appointment.staffid':staffid,
					'appointment.time': {$lt:time},
					'appointment.duration': {$gt:time},
					'appointment.date':k,
					'appointment.suffix':suffix,
				}
			},
			{
				$count: 'x'
			}
		],function(err,st){
			if(err){return next(err)}
			

			try{	
				
			res.json({count:st[0].x});
		}
		catch(error){
			res.json({count:0})
		}
			
		})
}


exports.setNotif = function(req,res,next){

			let {
				userid,
				not
			} = req.body;

			if(not===1){
					Staff.update({'appointment.userid':userid},{$set: {'appointment[0].notified1':"true"}},function(err){
					if(err){return next(err)}
						res.json('ok');

				})
			}
			else {
					Staff.update({'appointment.userid':userid},{$set: {'appointment[0].notified2':"true"}},function(err){
					if(err){return next(err)}
						res.json('ok')
				})
			}
 
       }



exports.transfer = async function(req,res,next){
	let {
		item,
		target
	} = req.body;









Staff.update({},{$pull:{'appointment':{'_id':item._id}}},function(err,resxv){
		if(err){return next(err)}
		 Staff.update({_id:target},{$addToSet:{appointment:item}},function(err,resx){
		if(err){return next(err)}
		res.json(resx)

		


	 })
	
	});

	 

	


}
