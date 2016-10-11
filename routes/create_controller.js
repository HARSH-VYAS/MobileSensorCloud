var express = require('express');
var mysql = require('../helper/mysql');
var child_process = require('child_process');

var create_controller = express.Router();


/**Add Sensor**/
create_controller.post('/',function(req,res){
        console.log("Controller Creation");
        var cmd = 'java8 -jar /home/ec2-user/jars/ControllerCreation.jar';
        child_process.exec(cmd, function (err, stdout, stderr){
                if (err) {
                        console.log("child processes failed with error code: " +
                                err.code);
                }
                console.log(stdout);
        });
});


module.exports = (function() {
        'use strict';
        return create_controller;
})();
