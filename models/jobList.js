var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var jobListSchema = new Schema({
	_id: String,
	title: {
		type: String,
		required: true
	},
	desc: String,
	start: {
		type: Date,
		default: Date.now
	},
	end: {
		type: Date,
		required: true
	},
	count: {
		type: Number,
		default: 0
	},
	list: [String],
	status: {
		type: Boolean,
		default: true
	},
	tags: [String]
});

module.exports = jobListSchema;
