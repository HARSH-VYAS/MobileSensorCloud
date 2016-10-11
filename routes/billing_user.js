var express = require('express');
var mysql = require('../helper/mysql');
var billing_user = express.Router();

/**Add admin**/
billing_user.post('/',function(req,res){
	console.log("Billing Info");
	if(!req.body.userid){
		res.status(400).json({
			status : 400,
			message : "Invalid Input"
		});
	}else{
		var uid = req.body.userid;
		console.log("Inside sensor db call");
		mysql.query('select count(sensor_id) as usagecount, s.sensor_type as sensorType,s.name as sensorName,d.sensorprice from dbuser281.Sensor_data s,dbuser281.sensor_info d where sensor_id in (select sensorid from dbuser281.sensor_dtls_tbl where ??=?) and s.sensor_type=d.sensortype group by sensor_type',
				['userid', uid],
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
	return billing_user;
})();

