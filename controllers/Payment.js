const Transaction = require('../models/transactionSchema');
const Staff =  require('../models/staffschema');

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

exports.getDaily = function(req,res,next){

	let {
		date
	} = req.body;
	date = new Date(date);
	let today=0;

	let thisweek=0;
	let thismonth=0;
	let day = date.getDate();
	let wk;
	let wk_ = day/7;
	
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
	
	let yr = date.getFullYear();
	console.log(mt,yr,day);


	Transaction.aggregate([
	{
		$match: {
			paid:true,
			
			day:day,
			month:mt,
			year:yr
		}
	}
		],function(err,transaction){
			if(err){return next(err)}
			res.json({transaction})
			console.log(transaction);
		})
	
}

exports.getWeekly = function(req,res,next){
	let {
		date
	} = req.body;
	date = new Date(date);


	let today=0;

	let thisweek=0;
	let thismonth=0;
	let day = date.getDate();
	let wk;
	let wk_ = day/7;
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
	
	let yr = date.getFullYear();



	Transaction.aggregate([
	{
		$match: {
			paid:true,
			week:wk,
			// day:day,
			month:mt,
			year:yr
		}
	}
		],function(err,transaction){
			if(err){return next(err)}
			res.json({transaction})
		})
}

exports.getMonthly = function(req,res,next){
	let {
		date
	} = req.body;
	date = new Date(date);
	let today=0;

	let thisweek=0;
	let thismonth=0;
	let day = date.getDate();
	let wk;
	let wk_ = day/7;
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
	
	let yr = date.getFullYear();



	Transaction.aggregate([
	{
		$match: {
			paid:true,
			// week:wk,
			// day:day,
			month:mt,
			year:yr
		}
	}
		],function(err,transaction){
			if(err){return next(err)}
			res.json({transaction})
		})
}


exports.getWorldwideTransaction = function(req,res,next){



	Transaction.aggregate([
	{
		$match: {
			paid:true
		}
	}
		],function(err,transaction){
			if(err){return next(err)}
			res.json({transaction})
		})
}

exports.getSales = async function(req,res,next){
	let {
		date=new Date()
	} = req.body;

	let today=0;

	let thisweek=0;
	let thismonth=0;

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



	

	await Transaction.aggregate(
			[{
							$match: {
								paid:true,
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
			try{
			today=counted[0].count;
			}catch(error){}
			
		});


		await Transaction.aggregate(
			[{
							$match: {
								paid:true,
								week:wk,
								month:mt,
								year:yr,
							}
						},
						{
							$count:'count'
						}]
		,function(err,counted){
			if(err){return next(err)}
			try{
			thisweek=counted[0].count;
			}catch(error){}
			
		})

		await Transaction.aggregate(
			[{
							$match: {
								paid:true,
								month:mt,
								year:yr,
							}
						},
						{
							$count:'count'
						}]
		,function(err,counted){
			if(err){return next(err)}
			try{
			thismonth=counted[0].count;
			}catch(error){}

			res.json({today,thisweek,thismonth})
			
		})
 
		
}    



exports.getInventoryTransaction = function(req,res,next){
	
	

    Transaction.find({},{_id:0,products:1},function(err,inventory){
    	if(err){return next(err)}
    	res.json(inventory);
}) 
    } 


exports.getPaymentTransaction = function(req,res,next){
	Transaction.aggregate([
			{
				$match: {
					paid:true,
				}
			}
		],function(err,payment){
			if(err){return next(err)}
			res.json(payment);
		})
}


exports.realSales = async function(req,res,next){
	let {
		month,year
	} = req.body;

	let earn;
	let sal;
	let inv;

	await Transaction.aggregate([
			{
				$match: {
					month,
					year,
					paid:true,
				}
			},
			{
				$group: {
					_id:null,
					price: {$sum: '$price'}
				}
			}
		],function(err,earnings){
			if(err){return next(err)}
			earnings.map(function(item){
				earn=item.price;
			})
		})


	await Transaction.aggregate([

			{
				$unwind:'$products'
			},

			
			
			{
				$match: {
					month,
					year,
					paid:true,
				}
			},
			{
				$project: {
					_id:0,

					'products.price':1
				}
			},
			// {
			// 	$group: {
			// 		_id:null,
			// 		total: {$sum: '$products.price'}
			// 	}
			// }
			
			
		],function(err,prices){
			if(err){return next(err)}
			let price = [];
			prices.map(function(item){
				
					price.push(!item.products.price ? 0:parseInt(item.products.price));
				
			})
			inv = price.reduce((a,b)=>a+b,0);
		})

	await Staff.aggregate([
			
			{
				$match: {
					
				}
			},
			{
				
					$group: {
						_id:null,
						salary: {$sum: '$salary'}
					}
				
			}
		],function(err,used){
			if(err){return next(err)}
			used.map(function(item){
				sal=item.salary
			})

			res.json({earn,inv,sal})
		})
}


exports.setSalary = function(req,res,next){
	let {
		salary,
		staffid
	} = req.body;

	
	if(!staffid){

	Staff.update({},{$set:{salary}},{multi:true},function(err){
		if(err){return next(err)}
		res.json('ok !')
	})
	}
	if(staffid){

	Staff.update({_id:staffid},{$set:{salary}},{multi:true},function(err){
		if(err){return next(err)}
		res.json('ok jez')
	})
	}

	
}


exports.getSpecificInventory = function(req,res,next){
	let {
		staffid
	} = req.body;
	let sp = [];
	Transaction.find({staffid},{_id:0,products:1},async function(err,spinv){
		if(err){return next(err)}
		await spinv.map(function(item){
			item.products.map(function(item){
				sp.push(item)
			})
		})
		res.json({sp})
	})
}

exports.getUsed = function(req,res,next){
	let {
		staffid
	} = req.body;

	let inv = [];

	Transaction.find({},async function(err,invent){
		if(err){return next(err)}
		res.json({invent});
	})
}

