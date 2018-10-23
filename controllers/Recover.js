const nodeMailer = require('nodemailer');
const Customer = require('../models/customerschema');
const bcrypt = require('bcrypt-nodejs');


exports.sendMobile = async function(req,res,next){

	let {
		username
	} = req.body;

	let found = 0;
	let pass;
	let hashx;

	//console.log(email);

	pass= Math.random().toString(36).slice(-8);

	 await bcrypt.genSalt(10,function(err,salt){
		if(err){return next(err)}
		bcrypt.hash(pass,salt,null,function(err,hash){
				if(err){return next(err)}
				hashx=hash;
		})
	})

	await Customer.update({username},{$set:{password:hashx}},function(err,account){
			if(err){return next(err)}
			res.json({password:pass});;
	})

	

	



	// let transporter = nodeMailer.createTransport({
	// 	service: 'Gmail',
 //          host: 'smtp.gmail.com',
 //          port: 465,
 //          secure: true,
 //          auth: {
 //              user: 'llsalonrecover@gmail.com',
 //              pass: 'Alucard123'
 //          }
 //      });
 //      let mailOptions = {
 //          from: '"LadyLyn Salon" <xx@gmail.com>', // sender address
 //          to: `${email}`, // list of receivers
 //          subject: 'New Password', // Subject line
 //          text:'X', // plain text body
 //          html: `<b>Your new password is ${pass}</b>` // html body
 //      };

 //      transporter.sendMail(mailOptions, (error, info) => {
 //          if (error) {
 //              //res.json(error)
 //              return next(err)
 //          }
 //         res.json("ok")
 //      })


}