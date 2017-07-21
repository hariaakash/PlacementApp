var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || 5000;
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var admin = require('./routes/admin.js')
var comp = require('./routes/comp.js');
var user = require('./routes/user.js');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/placement_app')
	.then(function () {
		console.log('Connected to MONGODB !!');
	}).catch(function (err) {
		console.log('Failed to establish connection with MONGOD !!');
		console.log(err.message);
	});


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.use('/admin', admin);
app.use('/comp', comp);
app.use('/user', user);


app.get('/', function (req, res) {
	res.json('LADADADADAH');
});


app.listen(port, ip);
console.log('Server running on : ' + ip + ':' + port);
