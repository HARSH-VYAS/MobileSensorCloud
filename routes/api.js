var express = require('express')

var sensor_user = require('./sensor_user');
var sensor_data = require('./sensor_data');
var billing_user = require('./billing_user');
var create_sensor = require('./create_sensor');
var manage_sensor = require('./manage_sensor');
var instance_info = require('./instance_info');
var create_controller = require('./create_controller')
var login = require('./login');
var signup = require('./signup');

var api = express.Router();

api.use('/sensor_user',sensor_user);
api.use('/sensor_data',sensor_data);
api.use('/billing_user',billing_user);
api.use('/create_sensor',create_sensor);
api.use('/manage_sensor',manage_sensor);
api.use('/instance_info',instance_info);
api.use('/create_controller',create_controller);
api.use('/login',login);
api.use('/signup',signup);


module.exports = (function() {
	return api;
})();