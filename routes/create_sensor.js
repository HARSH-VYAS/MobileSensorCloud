var express = require('express');
var mysql = require('../helper/mysql');
var child_process = require('child_process');

var create_sensor = express.Router();


/**Add Sensor**/
create_sensor.post('/',function(req,res){
        console.log("Sensor Creation");
        if(!req.body.name || !req.body.type || !req.body.userid){
                res.status(400).json({
                        status : 400,
                        message : "Invalid Input"
                });
        }else{
                var sname = req.body.name;
                var stype = req.body.type;
                var uid = req.body.userid;
                //var cmd = 'java8 -jar /home/ec2-user/jars/ControllerCreation.jar ' + sname + ' ' + stype;
                var cmd = 'java8 -jar /home/ec2-user/jars/SensorCreation.jar ' + uid + ' ' + sname + ' ' + stype;
                child_process.exec(cmd, function (err, stdout, stderr){
                        if (err) {
                                console.log("child processes failed with error code: " +
                                        err.code);
                        }
                        console.log(stdout);
                });
        }
});


module.exports = (function() {
        'use strict';
        return create_sensor;
})();
