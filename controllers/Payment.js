const Transaction = require('../models/transactionSchema');

// make payment

exports.makePayment = function(req,res,next){
	let {
		newPrice,
		products,
		service,
		tid
	} = req.body;

	let paid = new Transaction({
		paid:true
	});

	let paidObj = paid.toObject();
	delete paidObj._id;

	if(!newPrice && !products && !service){
		Transaction.update({_id:tid},paidObj,function(err){
			if(err){return next(err)}
			res.json('ok')
		})
	}

}

exports.getPayments = function(req,res,next){
	console.log("RECEIVED");
	Transaction.find({$or:[{remit:false},{paid:false}]},function(err,payments){
		if(err){return next(err)}
		res.json({payments:payments});

	})
}

exports.getSpecificPayments = function(req,res,next){
	console.log("RECEIVED");
	let {
		userid
	} = req.body;
	Transaction.find({$or:[{remit:false},{paid:false}],userid:userid},function(err,payments){
		if(err){return next(err)}
		res.json({payments:payments});

	})
}

exports.deletePayment = function(req,res,next){
	let {
		tid
	} = req.body;

	Transaction.deleteOne({_id:tid},function(err){
		if(err){return next(err)}
		res.json('ok');
	})
}

exports.getAllLiveAppointments = function(req,res,next){
	
}

exports.getWorldwideTransaction = function(req,res,next){
	Transaction.find({},function(err,transaction){
		if(err){return next(err)}
		res.json({transaction})
	})
}

exports.getSales = async function(req,res,next){
	let {
		date=new Date()
	} = req.body;

	let wk;
	let wk_ = date.getDate()/7;
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
	let mt = date.getMonth()+1;
	let day = date.getDate();
	let yr = date.getFullYear();
	console.log(yr);
	

	Transaction.aggregate(
			[{
							$match: {
								week:wk,
								month:mt,
								day:day,
								year:yr,
							}
						},
						{
							$count:'count'
						}]
		,function(err,counted){
			if(err){return next(err)}
			res.json({counted}) 
		})
}     