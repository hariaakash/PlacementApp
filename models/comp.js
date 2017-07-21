var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jobListSchema = require('./jobList');

mongoose.Promise = global.Promise;

var compSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	website: String,
	img: String,
	jobList: [jobListSchema]
});

module.exports = mongoose.model('Comp', compSchema);
