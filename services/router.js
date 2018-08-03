var router = require('express').Router();
const passportService = require('./passport');
const passport = require('passport');
const AuthenticationController = require('../controllers/authentication_controller');
const CustomerInfoController = require('../controllers/CustomerInfoController');
const TransactionController = require('../controllers/TransactionController');
var requireAuth = passport.authenticate('jwt',{session: false});
var requireLogin = passport.authenticate('local',{session: false});

// Auth 


router.route('/signup')
	.post(AuthenticationController.signup);

router.route('/signin')
	.post([requireLogin,AuthenticationController.signin]);

router.route('/customersignup')
	.post(AuthenticationController.customersignup);
router.route('/customersignin')
	.post(AuthenticationController.customersignin);
router.route('/services')
	.post(AuthenticationController.services);
router.route('/addservices')
	.post(AuthenticationController.addservices);
router.route('/staffBulk')
	.post(AuthenticationController.staffBulk);
router.route('/availservice')
	.post(AuthenticationController.availservice);
router.route('/savecustomer')
	.post(CustomerInfoController.savecustomer);
router.route('/savecustomerservices')
	.post(CustomerInfoController.saveCustomerServices);
router.route('/savecustomerlocation')
	.post(CustomerInfoController.saveCustomerLocation);
router.route('/saveadminreport')
	.post(TransactionController.saveAdminReport);
router.route('/savetransaction')
	.post(TransactionController.saveTransaction);


// XXX
// function protected(req,res,next){
// 	res.send("Secret");
// }

// router.route('/protected')
// 	.get(requireAuth,protected);

module.exports = router;