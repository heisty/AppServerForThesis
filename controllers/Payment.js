const Transaction = require('../models/transactionSchema');
const Staff =  require('../models/staffschema');
const Suggestion = require('../models/suggestion');
const Product = require('../models/Product');

// make payment

exports.makePayment = async function(req,res,next){
	let {
		newPrice,
		products,
		service,
		tid
	} = req.body;

	let paid = new Transaction({
		paid:true,
		products
	});
	

	let paidObj = paid.toObject();
	delete paidObj._id;

	
		Transaction.update({_id:tid},paidObj,function(err){
			if(err){return next(err)}
			res.json('ok')
		})
	

}

exports.getPayments = function(req,res,next){
	console.log("RECEIVED");
	Transaction.find({$or:[{remit:false},{paid:false}],status:'completed'},function(err,payments){
		if(err){return next(err)}
		try{
		res.json({payments:payments});
	}catch(error){return next(err)}

	})
}

exports.getSpecificPayments = function(req,res,next){
	console.log("RECEIVED");
	let {
		userid
	} = req.body;
	Transaction.find({$or:[{remit:false},{paid:false}],userid:userid},function(err,payments){
		if(err){return next(err)}
		try{
		res.json({payments:payments});
	}catch(error){return next(err)}

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
	
	Staff.find({'appointment.accepted':false},function(err,appointments){
		if(err){return next(err)}
		res.json({appointments});
	})

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
	let sales;


	await Transaction.aggregate([
			{
				$match: {
					month,
					year,
					paid:true,
				}
			},
			{
				$count:'sales'
			}
		],function(err,sale){
			try{
			sales=sale[0].sales;
		}
		catch(error){}
		})



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

			res.json({earn,inv,sal,sales})
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

exports.getEMS = async function(req,res,next){

	let {
		staffid,
		date=new Date()
	} = req.body;


	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let day = date.getDate();
	let week = date.getDate()/7;

	if(week<=1)week=1
	if(week>1 && week<=2)week=2
	if(week>2 && week<=3)week=3
	if(week>3 && (week<=4 || week>4)) week=4

	let daily;
	let custno;
	let custrated;
	let custrating;

	let totalcustno;

	let weekly;
	let monthly;
	let yearly;


	await Transaction.aggregate([

			{
				$match: {

					staffid,
					month,
					year,
					day,
					paid:true,
				}
			},
			{
				$count: 'cno'
			}

		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				custno=item.cno;
			})
			//res.json({custno})
	})


	await Transaction.aggregate([

			{
				$match: {

					staffid,
					month,
					year,
					day,
					paid:true,
				}
			},
			{
				$group: {

					_id:null,
					'dt':{$sum:'$price'}
				}
			}

		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				daily=item.dt
			})

		//res.json({custno,daily});
			
	})

	await Transaction.aggregate([

			{
				$match: {

					staffid,
					week,
					year,
					paid:true,
				}
			},
			{
				$group: {

					_id:null,
					'dt':{$sum:'$price'}
				}
			}

		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				weekly=item.dt
			})

		
			
	})

	await Transaction.aggregate([

			{
				$match: {

					staffid,
					month,
					year,
					paid:true,
				}
			},
			{
				$group: {

					_id:null,
					'dt':{$sum:'$price'}
				}
			}

		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				monthly=item.dt

			})

		
			
	})

	

	await Transaction.aggregate([

			{
				$match: {

					staffid,
					paid:true,
					year
				}
			},
			{
				$group: {

					_id:null,
					'dt':{$sum:'$price'}
				}
			}

		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				yearly=item.dt
			})


			//res.json({custno,daily,weekly,monthly,yearly})
		
			
	})

	await Transaction.aggregate([
			{
				$match: {
					staffid,
					paid:true,
					rating: {$gt: 0}
				}
			},
			
			{
				$count: 'res'
			}
		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				custrated=item.res
			})
	})

	await Transaction.aggregate([
			{
				$match: {
					staffid,
					paid:true,
					rating: {$gt: 0}
				}
			},
			
			{
				$group: {
					_id:null,
					'rate':{$sum:'$rating'}
				}
			}
		],function(err,result){
			if(err){return next(err)}
			result.map(function(item){
				custrating=(parseInt(item.rate)/5)*100;
				
			})
	})

	//res.json(custrating);
	res.json({custno,daily,weekly,monthly,yearly,custrated,custrating})



}


exports.suggestion = function(req,res,next){
	let {
		userid,customer,suggestion
	} = req.body;

	let suggestionModel = new Suggestion({
		...req.body
	});

	suggestionModel.save(function(err){
		if(err){return next(err)}
		res.json('suggestion added');
	})
}

exports.getSuggestion = function(req,res,next){
	Suggestion.find({},function(err,suggestion){
		if(err){return next(err)}
		res.json({suggestion});
	})
}

exports.findUnrated = function(req,res,next){
	let {userid} = req.body;
	Transaction.findOne({userid:userid,rating:0},{_id:1},function(err,unrate){
		if(err){return next(err)}
		res.json({unrate});
	})
}



exports.rate = async function(req,res,next){
	let {
		_id,
		rating,
		suggestion,
		customer
	} = req.body;

	 Transaction.update({_id},{$set:{rating}},function(err,result){
		if(err){return next(err)}

		let suggest =  new Suggestion({
		userid:_id,
		customer,
		suggestion
	});

	suggest.save(function(err){
		if(err){return next(err)}
		res.json('ok')
	})
		
	});

	
}


exports.alterInv = async function(req,res,next){
	let {
		products
	} = req.body;


	let quant = 0;


	await products.map(function(item){

		quant = item.quantity;
		name = item.name;

		console.log(item)

		Product.update({productname:name},{$inc:{quantity:-quant}},function(err){
		if(err){return next(err)}
		
	})
	})

	res.json("ok")
}