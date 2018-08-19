const mongoose = require('mongoose');

const categories = mongoose.Schema({
	catname: {type: String},
	avatarLink: {type: String},
	featured: {type: Boolean},
});

module.exports = mongoose.model('category',categories);