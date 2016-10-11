var express = require('express');
var mysql = require('../helper/mysql');

var instance_info = express.Router();


/**Instance Info**/
instance_info.post('/',function(req,res){
	console.log("Sensor Info");
	if(!req.body.userid && !req.body.userid == 1){
		res.status(400).json({
			status : 400,
			message : "Invalid Input"
		});
	}else{
		var uid = req.body.userid;
		console.log("Inside Instance Info db call");
		mysql.query('SELECT DISTINCT * FROM dbuser281.instance_stats a WHERE a.time =(SELECT  MAX(time) time FROM    dbuser281.instance_stats b WHERE   a.External_IP = b.External_IP) and a.Internal_IP!="172.31.30.38";',
				[],
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
	return instance_info;
})();

