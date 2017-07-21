var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var hat = require('hat');
//var requestIp = require('request-ip');
var Admin = require('../models/admin');
var Comp = require('../models/comp');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function (req, res) {
	if (req.query.authKey) {
		Admin.findOne({
				authKey: req.query.authKey
			})
			.then(function (admin) {
				if (admin) {
					Comp.find({})
						.then(function (comps) {
							res.json({
								status: true,
								msg: 'Yay here is your data',
								data: comps
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

app.post('/create', function (req, res) {
	if (req.body.authKey && req.body.name && req.body.desc && req.body.website) {
		Admin.findOne({
				authKey: req.body.authKey
			})
			.then(function (admin) {
				if (admin) {
					var comp = new Comp();
					comp.name = req.body.name;
					comp.desc = req.body.desc;
					comp.website = req.body.website;
					comp.save();
					admin.logs.push({
						log: 'Created company : ' + comp.name
					});
					admin.save();
					res.json({
						status: true,
						msg: 'Company created successfully !!'
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

app.post('/delete', function (req, res) {
	if (req.body.authKey && req.body.id) {
		Admin.findOne({
				authKey: req.body.authKey
			})
			.then(function (admin) {
				if (admin) {
					Comp.findOne({
							_id: req.body.id
						})
						.then(function (comp) {
							if (comp) {
								comp.remove();
								res.json({
									status: true,
									msg: 'Company deleted successfully !!'
								});
								admin.logs.push({
									log: 'Deleted company : ' + comp.name
								});
								admin.save();
							} else {
								res.json({
									status: false,
									msg: 'Company not found !!'
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

app.post('/createJob', function (req, res) {
	if (req.body.authKey && req.body.title && req.body.desc && req.body.end && req.body.id && req.body.tags) {
		Admin.findOne({
				authKey: req.body.authKey
			})
			.then(function (admin) {
				if (admin) {
					Comp.findOne({
							_id: req.body.id
						})
						.then(function (comp) {
							if (comp) {
								comp.jobList.push({
									_id: hat(),
									title: req.body.title,
									desc: req.body.desc,
									tags: req.body.tags,
									end: req.body.end
								});
								admin.logs.push({
									log: 'Job created for company : ' + comp.name
								});
								admin.save();
								comp.save();
								res.json({
									status: true,
									msg: 'Job added successfully !!'
								});
							} else {
								res.json({
									status: false,
									msg: 'Company not found !!'
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

app.post('/deleteJob', function (req, res) {
	if (req.body.authKey && req.body.id && req.body.jid) {
		Admin.findOne({
				authKey: req.body.authKey
			})
			.then(function (admin) {
				if (admin) {
					Comp.findOne({
							_id: req.body.id
						})
						.then(function (comp) {
							if (comp) {
								comp.jobList = comp.jobList.filter(function (item) {
									return item._id !== req.body.jid
								});
								admin.logs.push({
									log: 'Job deleted for company : ' + comp.name
								});
								admin.save();
								comp.save();
								res.json({
									status: false,
									msg: 'Job deleted successfully !!'
								});
							} else {
								res.json({
									status: false,
									msg: 'Company not found !!'
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
