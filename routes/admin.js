var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var hat = require('hat');
//var requestIp = require('request-ip');
var Admin = require('../models/admin');
var User = require('../models/user');
var Comp = require('../models/comp');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function (req, res) {
	res.json('YALA YOLO');
});

app.post('/register', function (req, res) {
	if (req.body.email && req.body.password && req.body.qq == 1234) {
		Admin.findOne({
				email: req.body.email
			})
			.then(function (admin) {
				if (!admin) {
					bcrypt.hash(req.body.password, 10, function (err, hash) {
						var admin = new Admin();
						admin.email = req.body.email;
						admin.password = hash;
						admin.save();
						admin.logs.push({
							log: 'Registered admin.'
						});
						res.json({
							status: true,
							msg: 'Admin created successfully !!'
						});
					});
				} else {
					res.json({
						status: false,
						msg: 'Admin already registered !!'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Error when querying'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Input Missing'
		});
	}
});

app.post('/login', function (req, res) {
	if (req.body.email && req.body.password) {
		Admin.findOne({
				email: req.body.email
			})
			.then(function (admin) {
				if (admin) {
					bcrypt.compare(req.body.password, admin.password, function (err, response) {
						if (response == true) {
							admin.authKey = hat();
							admin.logs.push({
								log: 'Logged in.'
							});
							admin.save();
							res.json({
								status: true,
								authKey: admin.authKey,
								msg: 'Successfully signed in !!'
							});
						} else {
							res.json({
								status: false,
								msg: 'Password Wrong'
							});
						}
					});
				} else {
					res.json({
						status: false,
						msg: 'Restricted Access'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Error when querying'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Input Missing'
		});
	}
});

app.post('/createUser', function (req, res) {
	if (req.body.authKey && req.body.name && req.body.email && req.body.dept && req.body.regno) {
		var password = Math.random().toString(36).slice(-8);
		Admin.findOne({
				authKey: req.body.authKey
			})
			.then(function (admin) {
				if (admin) {
					User.findOne({
							regno: req.body.regno
						})
						.then(function (user) {
							if (!user) {
								bcrypt.hash(password, 10, function (err, hash) {
									var user = new User();
									user.name = req.body.name;
									user.password = hash;
									user.email = req.body.email;
									user.dept = req.body.dept;
									user.regno = req.body.regno;
									user.save();
									admin.logs.push({
										log: 'Created user : ' + user.email
									});
									admin.save();
									res.json({
										status: true,
										msg: 'User created successfully !!',
										password: password
									});
								});
							} else {
								res.json({
									status: false,
									msg: 'Regno already registered !!'
								});
							}
						})
						.catch(function (err) {
							console.log(err);
							res.json({
								status: false,
								msg: 'Error when querying'
							});
						});
				} else {
					res.json({
						status: false,
						msg: 'Restricted Area'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Error when querying'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Input Missing'
		});
	}
});

app.post('/deleteUser', function (req, res) {
	if (req.body.authKey && req.body.regno) {
		Admin.findOne({
				authKey: req.body.authKey
			})
			.then(function (admin) {
				if (admin) {
					User.findOne({
							regno: req.body.regno
						})
						.then(function (user) {
							if (user) {
								user.remove();
								admin.logs.push({
									log: 'Deleted user : ' + user.regno
								});
								admin.save();
								res.json({
									status: true,
									msg: 'User deleted successfully !!'
								});
							} else {
								res.json({
									status: false,
									msg: 'Regno not found !!'
								});
							}
						})
						.catch(function (err) {
							console.log(err);
							res.json({
								status: false,
								msg: 'Error when querying'
							});
						});
				} else {
					res.json({
						status: false,
						msg: 'Restricted Area'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Error when querying'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Input Missing'
		});
	}
});


module.exports = app;
