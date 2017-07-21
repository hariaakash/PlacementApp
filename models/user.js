var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var userSchema = new Schema({
	email: String,
	name: String,
	regno: String,
	dept: String,
	password: String,
	jobList: [String],
	authKey: String
});

module.exports = mongoose.model('User', userSchema);
