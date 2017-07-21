var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var adminSchema = new Schema({
	email: String,
	password: String,
	logs: [{
		log: String,
		ip: String,
		date: {
			type: Date,
			default: Date.now
		}
	}],
	authKey: String
});

module.exports = mongoose.model('Admin', adminSchema);
