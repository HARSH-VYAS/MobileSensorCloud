var express = require('express');
var mysql = require('../helper/mysql');

var sensor_user = express.Router();


/**Add admin**/
sensor_user.post('/',function(req,res){
	console.log("Sensor Info");
	if(!req.body.userid){
		res.status(400).json({
			status : 400,
			message : "Invalid Input"
		});
	}else{
		var uid = req.body.userid;
		console.log("Inside sensor db call");
		mysql.query('SELECT * FROM sensor_dtls_tbl WHERE ?? = ?',
				['userid',uid],
				function(err,response){
				if (err) {
					console.log("Error while perfoming query !!!");
					res.status(500).json({
						status : 500,
						message : "Server Error. Please try again later"
					});
				} else {
					//console.log("response : " + JSON.stringify(response));
					res.status(200).json({
						status : 200,
						message : response
					});
				}
			});
	}
});


module.exports = (function() {
	'use strict';
	return sensor_user;
})();

