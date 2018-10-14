const ITransaction = require('../models/inventoryTransaction');

exports.itransact = function(req,res,next){
	


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
		year: dte.getFullYear()
	});


		itransaction.save(function(err){
			if(err){return next(err)}
			res.json("Saved");
		})
	


}