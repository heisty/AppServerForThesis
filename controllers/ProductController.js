const Cat = require('../models/Categories');
const Service = require('../models/serviceSchema');
const Product = require('../models/Product');

exports.addCat=function(req,res,next){
	var cat = new Cat({
		...req.body
	});

	cat.save(function(err){
		if(err){return next(err)}
		res.json("Saved Cat");
	});
}

exports.updateCat = function(req,res,next) {
	let {
		_id
	} = req.body;

	let cat = new Cat({
		...req.body,
	});

	let catObj = cat.toObject();
	delete catObj._id;

	Cat.update({_id:_id},catObj,function(err){
		if(err){return next(err)}
		res.json("ok");
	})
}

exports.getCat = function(req,res,next){
		
	let {
		catfor
	} = req.body;


	console.log(catfor);

	if(catfor){
		Cat.find({catfor},function(err,category){
		if(err){return next(err)}
		res.json({category});
	});
	}

	if(!catfor){
		Cat.find({},function(err,category){
		if(err){return next(err)}
		res.json({category});
	})
	}


}

exports.getServiceType = function(req,res,next){
	let {
		service 
	} = req.body;

	Service.find({title:service},{'types':1,'_id':0},function(err,types){
		if(err){return next(err)}
		res.json(types)
	});

}

exports.addProduct = function(req,res,next){
	let product = new Product({
		...req.body,
		type: 'product'
	});

	product.save(function(err){
		if(err){return next(err)}
		res.json("Saved");
	});
}


exports.updateProduct = function(req,res,next){

	let {
		_id
	} = req.body;

	console.log(_id);

	let product = new Product({
		...req.body,
		type: 'product'
	});

	let productObj = product.toObject();
	delete productObj._id;


	Product.update({_id:_id},productObj,function(err){
		if(err){console.log("ERRORORORO",err); return next(err)}
		console.log("OKOKOK");
		res.json("Ok")
	})
}



exports.getProduct = function(req,res,next){

	let {
		category
	} = req.body;

	if(category){
		Product.find({category},function(err,product){
		if(err){return next(err)}
		res.json({product});
		})
	}
	if(!category){
	Product.find({},function(err,product){
		if(err){return next(err)}
		res.json({product});
	});
}
}

exports.getInventory = async function(req,res,next){

	let {
		cat,
		type
	} = req.body;

	let inventory = [];

		await Service.find({},function(err,service){
			if(err){return next(err)}
			
			service.map(function(item){
				let s_ = item;
				inventory.push(item);
			});

		});

		await Product.find({},function(err,product){
			if(err){return next(err)}
			product.map(function(item){
				let p_ = item;
				inventory.push(item);
				

			})
			res.json({inventory});
		})

		

	


}

exports.deleteProduct = function(req,res,next){
	let {
		_id
	} = req.body;

	Product.deleteOne({_id:_id},function(err){
		if(err){return next(err)}
		res.json("ok");
	})
}


exports.deleteCat = function(req,res,next){
	let {
		_id
	} = req.body;

	Cat.deleteOne({_id:_id},function(err){
		if(err){return next(err)}
		res.json("ok");
	})
}


exports.deleteService = function(req,res,next){
	let {
		_id
	} = req.body;

	Service.deleteOne({_id:_id},function(err){
		if(err){return next(err)}
		res.json("ok");
	})
}