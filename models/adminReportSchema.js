const mongoose = require('mongoose');

const adminReportSchema = mongoose.Schema({
	staffid: {type: String},
	transactionid: {type: String},
});

module.exports = mongoose.model('adminreport',adminReportSchema);