var router = require('express').Router();
const passportService = require('./passport');
const passport = require('passport');
const StaffController = require('../controllers/StaffController');
const Schedule = require('../controllers/Schedule');
const Product = require('../controllers/ProductController');
const AuthenticationController = require('../controllers/authentication_controller');
const CustomerInfoController = require('../controllers/CustomerInfoController');
const TransactionController = require('../controllers/TransactionController');
var requireAuth = passport.authenticate('jwt',{session: false});
var requireLogin = passport.authenticate('local',{session: false});
const Payment = require('../controllers/Payment');
const Verify = require('../controllers/Verify');
const Recover = require('../controllers/Recover');

// Auth 

function app(req,res,next){
	res.send("RUNNING LIVE SERVER FOR THESIS...")
}
 
router.route('/')
		.get(app);

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
router.route('/staffSpecialBulk')
	.post(AuthenticationController.staffSpecialBulk);
router.route('/customerBulk')
	.post(AuthenticationController.customerBulk);
router.route('/availservice')
	.post(AuthenticationController.availservice);
router.route('/savecustomer')
	.post(CustomerInfoController.savecustomer);
router.route('/updateservices')
	.post(AuthenticationController.updateservices);
router.route('/savecustomerservices')
	.post(CustomerInfoController.saveCustomerServices);
router.route('/updatecustomer')
	.post(CustomerInfoController.updateCustomerProfile);
router.route('/saveadminreport')
	.post(TransactionController.saveAdminReport);
router.route('/savetransaction')
	.post(TransactionController.saveTransaction);
router.route('/alreadyhaveservice')
	.post(AuthenticationController.alreadyhaveservice);
router.route('/addcustomerservice')
	.post(CustomerInfoController.addcustomerservice);
router.route('/updatecustomerservicestate')
	.post(CustomerInfoController.updatecustomerservicestate);
router.route('/returnactivecustomerservices')
	.post(CustomerInfoController.returnActiveCustomerServices);
router.route('/updatecustomerinfo')
	.post(CustomerInfoController.updateCustomerInfo);
router.route('/countactive')
	.post(CustomerInfoController.countActive);
router.route('/positionactive')
	.post(CustomerInfoController.positionActive);
router.route('/getrecords')
	.post(CustomerInfoController.getRecords);
router.route('/getcustomerinfo')
	.post(CustomerInfoController.getCustomerInfo);
router.route('/getactivestaffid')
	.post(CustomerInfoController.getActiveStaffId);
router.route('/getappointment')
	.post(StaffController.getAppointment);
router.route('/updatecustomeraddress')
	.post(CustomerInfoController.updateCustomerAddress);
router.route('/getstafftransaction')
	.post(StaffController.getStaffTransaction);
router.route('/retrievestaffprofile')
	.post(StaffController.retrieveStaffProfile);
router.route('/updatestaffprofile')
	.post(StaffController.updateStaffProfile);
router.route('/loginadmin')
	.post(StaffController.loginAdmin);
router.route('/signupadmin')
	.post(StaffController.signupAdmin);
router.route('/customerqueue')
	.post(StaffController.customerQueue);
router.route('/addskills')
	.post(StaffController.addSkills);
router.route('/verify')
	.post(Verify.verify);

// deletes
router.route('/deletebyid')
	.post(AuthenticationController.deleteById);
router.route('/deleteservices')
	.post(AuthenticationController.deleteservices);
router.route('/deletebycustomerid')
	.post(AuthenticationController.deleteByCustomerId);
router.route('/deleteactiveavail')
	.post(StaffController.deleteActiveAvail);

// Transactions

router.route('/gww')
	.post(Payment.getWorldwideTransaction);

router.route('/gd')
	.post(Payment.getDaily);

router.route('/gw')
	.post(Payment.getWeekly);

router.route('/gm')
	.post(Payment.getMonthly);
// PRODs


router.route('/orderservice')
	.post(StaffController.orderService);
router.route('/addcat')
	.post(Product.addCat);
router.route('/getcat')
	.post(Product.getCat);
router.route('/getservicetype')
	.post(Product.getServiceType);
router.route('/addproduct')
	.post(Product.addProduct);
router.route('/getproduct')
	.post(Product.getProduct);
router.route('/getinventory')
	.post(Product.getInventory);


router.route('/updatecat')
	.post(Product.updateCat);

router.route('/updateproduct')
	.post(Product.updateProduct);

router.route('/deletecat')
	.post(Product.deleteCat);

router.route('/deleteproduct')
	.post(Product.deleteProduct);

router.route('/deleteservice')
	.post(Product.deleteService);


// change pass
router.route('/changepass')
	.post(AuthenticationController.changeCustomerPassword);



// schedules


router.route('/getscheduledemployees')
	.post(Schedule.getScheduledEmployees);

router.route('/getlaterscheduled')
	.post(Schedule.getLaterScheduled);
router.route('/getneveravailable')
	.post(Schedule.getNeverAvailable);
router.route('/setappointment')
	.post(Schedule.setAppointment);
router.route('/checkappointment')
	.post(Schedule.checkAppointment);
router.route('/getmyapp')
	.post(Schedule.getMyAppointment);
router.route('/mypos')
	.post(Schedule.myPositionOnQueue);
router.route('/setschedule')
	.post(Schedule.setSchedule);
router.route('/resetschedule')
	.post(Schedule.resetSchedule);
router.route('/cancelorder')
	.post(Schedule.cancelOrder);
router.route('/updateorder')
	.post(Schedule.updateOrder);
router.route('/acceptap')
	.post(Schedule.acceptAp);
router.route('/rejectap')
	.post(Schedule.rejectAp);
router.route('/setcompleteap')
	.post(Schedule.setCompleteAp);
router.route('/gas')
	.post(Schedule.getAllSchedule);

// customer shit

router.route('/mba')
	.post(Product.myBookedAppointments);


// get recents

router.route('/getcustrecent')
	.post(Schedule.getCustRecent);

router.route('/getstaffrecent')
	.post(Schedule.getStaffRecent);

router.route('/getalltransaction')
	.post(Schedule.getAllTransaction);

router.route('/numberofcustomers')
	.post(Schedule.numberOfCustomers);

router.route('/rating')
	.post(Schedule.rating);


// admin powers

router.route('/getcustomerlist')
	.post(CustomerInfoController.getCustomerList);
		
router.route('/makepayment')
			.post(Payment.makePayment);


router.route('/getpayments')
	.post(Payment.getPayments);

router.route('/deletepayment')
	.post(Payment.deletePayment);

router.route('/getsppayments')
	.post(Payment.getSpecificPayments);

router.route('/getala')
	.post(Payment.getAllLiveAppointments);	

router.route('/getsales')
	.post(Payment.getSales);	


router.route('/getinventorytransaction')
	.post(Payment.getInventoryTransaction);

router.route('/getpaymenttransaction')
	.post(Payment.getPaymentTransaction);
router.route('/realsales')
	.post(Payment.realSales);
router.route('/setsalary')
	.post(Payment.setSalary);
router.route('/getspinv')
	.post(Payment.getSpecificInventory);
router.route('/getused')
	.post(Payment.getUsed);
router.route('/getems')
	.post(Payment.getEMS);
router.route('/admin')
	.post(AuthenticationController.adminLogin);
router.route('/suggestion')
	.post(Payment.suggestion);

router.route('/fu')
	.post(Payment.findUnrated);
router.route('/rate')
	.post(Payment.rate);
router.route('/istaken')
	.post(Schedule.isTaken);

router.route('/gall')
	.post(TransactionController.getALL);

router.route('/notified')
	.post(TransactionController.notified);
router.route('/device')
	.post(TransactionController.setDevice);
router.route('/cd')
	.post(TransactionController.getCustDevice);
router.route('/getstats')
	.post(TransactionController.getStats);
	




router.route('/recover')
	.post(Recover.sendEmail);
// XXX
// function protected(req,res,next){
// 	res.send("Secret");
// }

// router.route('/protected')
// 	.get(requireAuth,protected);

module.exports = router;   