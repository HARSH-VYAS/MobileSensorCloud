var express = require('express');
var mysql = require('../helper/mysql');
var child_process = require('child_process');

var manage_sensor = express.Router();


/**Manage Sensor**/
manage_sensor.post('/',function(req,res){
        console.log("Sensor Management");
        if(!req.body.sensorid || !req.body.m_action || !req.body.userid){
                res.status(400).json({
                        status : 400,
                        message : "Invalid Input"
                });
        }else{
                var sid = req.body.sensorid;
                var s_action = req.body.m_action;
                var uid = req.body.userid;
        		mysql.query('select Private_IP,Public_IP from sensor_dtls_tbl where ??=? and ??=?;',
        				['userid',uid,'sensorId',sid],
        				function(err,response){
        				if (err) {
        					console.log("Error while perfoming query !!!");
        					res.status(500).json({
        						status : 500,
        						message : "Server Error. Please try again later"
        					});
        				} else {
        					console.log("response : " + JSON.stringify(response));
        					var pubip = response[0].Public_IP;
        					var pvtip = response[0].Private_IP
        				
        	                var cmd = '/home/ec2-user/SensorMaintain.sh ' + uid + ' ' + sid + ' ' + s_action + ' ' + pvtip + ' ' + pubip;
        					console.log("cmd: " + cmd);
        	                child_process.exec(cmd, function (err, stdout, stderr){
        	                        if (err) {
        	                                console.log("child processes failed with error code: " +
        	                                        err.code);
        	                        }
        	                        console.log(stdout);
        	                });
        	                
        					res.status(200).json({
        						status : 200,
        						message : "Action on Sensor Performed"
        					});
        				}
        			});
        }
});


module.exports = (function() {
        'use strict';
        return manage_sensor;
})();
