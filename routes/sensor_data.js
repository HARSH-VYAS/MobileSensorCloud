var express = require('express');
var mysql = require('../helper/mysql');

var sensor_data = express.Router();


/**Add admin**/
sensor_data.post('/',function(req,res){
	console.log("Sensor Data");
	if(!req.body.sensorids){
		res.status(400).json({
			status : 400,
			message : "Invalid Input"
		});
	}else{
		var sensorlist = req.body.sensorids;
		console.log("sensorlist : " + sensorlist);
		mysql.query('SELECT  sensor_id,sensor_type,name, SUBSTRING_INDEX(group_concat(timestamp order by timestamp desc),",",20) as Time, SUBSTRING_INDEX(group_concat(data order by timestamp desc),",",20) as Data FROM Sensor_data where ?? in (?) group by sensor_id;',
				['sensor_id',sensorlist],
				function(err,response){
				if (err) {
					console.log("Error while perfoming query !!!");
					res.status(500).json({
						status : 500,
						message : "Server Error. Please try again later"
					});
				} else {
					console.log("response : " + JSON.stringify(response));
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
	return sensor_data;
})();

