var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var hat = require('hat');
//var requestIp = require('request-ip');
var User = require('../models/user');
var Comp = require('../models/comp');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function (req, res) {
	if (req.query.authKey) {
		User.findOne({
				authKey: req.query.authKey
			})
			.then(function (user) {
				if (user) {
					Comp.find({})
						.then(function (comps) {
							var jobs = [];
							for (i = 0; i < comps.length; i++) {
								for (j = 0; j < comps[i].jobList.length; j++) {
									for (k = 0; k < user.jobList.length; k++) {
										if (user.jobList[k] == comps[i].jobList[j]._id)
											jobs.push(comps[i].jobList[j]);
									}
								}
							}
							res.json({
								status: true,
								msg: 'Here is your data',
								data: {
									email: user.email,
									name: user.name,
									regno: user.regno,
									dept: user.dept,
									jobs: jobs,
									comps: comps
								}
							});
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

app.post('/login', function (req, res) {
	if (req.body.regno && req.body.password) {
		User.findOne({
				regno: req.body.regno
			})
			.then(function (user) {
				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, response) {
						if (response == true) {
							user.authKey = hat();
							user.save();
							res.json({
								status: true,
								authKey: user.authKey,
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

app.post('/subscribe', function (req, res) {
	if (req.body.authKey && req.body.id) {
		User.findOne({
				authKey: req.body.authKey
			})
			.then(function (user) {
				if (user) {
					Comp.findOne({
							"jobList._id": req.body.id
						})
						.then(function (comp) {
							user.jobList.push(req.body.id);
							for (i = 0; i < comp.jobList.length; i++) {
								if (comp.jobList[i]._id == req.body.id) {
									comp.jobList[i].list.push(user._id);
									comp.jobList[i].count++;
								}
							}
							user.save();
							comp.save();
							res.json({
								status: true,
								msg: 'Successfully subscribed !!'
							});
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

app.post('/desubscribe', function (req, res) {
	if (req.body.authKey && req.body.id) {
		User.findOne({
				authKey: req.body.authKey
			})
			.then(function (user) {
				if (user) {
					Comp.findOne({
							"jobList._id": req.body.id
						})
						.then(function (comp) {
							for (i = 0; i < comp.jobList.length; i++) {
								if (comp.jobList[i].id == req.body.id) {
									comp.jobList[i].list = comp.jobList[i].list.filter(function (item) {
										return item._id == user._id
									});
									user.jobList = user.jobList.filter(function (item) {
										return item._id == req.body.id
									});
									comp.jobList[i].count--;
									comp.save();
									user.save();
									res.json({
										status: true,
										msg: 'Successfully desubscribed !!'
									});
								}
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
