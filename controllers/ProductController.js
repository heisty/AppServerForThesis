const Cat = require('../models/Categories');
const Service = require('../models/serviceSchema');
const Product = require('../models/Product');
const Staff  = require('../models/staffschema');
const Audit = require('../models/audit');

exports.addCat=function(req,res,next){
	var cat = new Cat({
		...req.body
	});

	cat.save(function(err){
		if(err){return next(err)}
		res.json("Saved Cat");
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
		process: 'Added Category',
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
		process: 'Updated Category',
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

	let {
		productname,
		productdescription,
		quantity
	} = req.body;

	product.save(function(err){
		if(err){return next(err)}
		res.json("Saved");
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
		process: `ADDED ${productname}`,
		type: 'Save',
		from: 'Website',
		date: new Date(),
		amount: `${quantity}`,
		sp: `${productname}`,
		record: 'Product',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
	})
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

	let {
		productname,
		productdescription,
		quantity
	} = req.body;

	let productObj = product.toObject();
	delete productObj._id;


	Product.update({_id:_id},productObj,function(err){
		if(err){console.log("ERRORORORO",err); return next(err)}
		console.log("OKOKOK");
		res.json("Ok")
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
		process: `Updated ${productname}`,
		type: 'Save',
		from: 'Website',
		date: new Date(),
		amount: `${quantity}`,
		sp: `${productname}`,
		record: 'Product',
		ip: y,
	});

	audit.save(function(err){
		if(err){
			return next(err)
		}
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
		process: `Delete Product ${_id}`,
		type: 'Delete',
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


exports.deleteCat = function(req,res,next){
	let {
		_id
	} = req.body;

	Cat.deleteOne({_id:_id},function(err){
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
		process: 'Delete Category',
		type: 'Delete',
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


exports.deleteService = function(req,res,next){
	let {
		_id
	} = req.body;

	Service.deleteOne({_id:_id},function(err){
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
		process: 'Delete Service',
		type: 'Delete',
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



// customer shit

exports.myBookedAppointments = function(req,res,next){
	let {
		userid
	} = req.body;

	Staff.find({'appointment.userid':userid},function(err,booked){
		if(err){return next(err)}
		res.json({booked});
	})
}