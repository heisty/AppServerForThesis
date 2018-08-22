const Cat = require('../models/Categories');
const Service = require('../models/serviceSchema');

exports.addCat=function(req,res,next){
	let {
		catname,
		avatarLink,
		featured,
	} = req.body;

	var cat = new Cat({
		catname: catname,
		avatarLink: avatarLink,
		featured: featured,
	});

	cat.save(function(err){
		if(err){return next(err)}
		res.json("Saved Cat");
	});
}

exports.getCat = function(req,res,next){
	Cat.find({},function(err,category){
		if(err){return next(err)}
		res.json({category:category});
	})
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