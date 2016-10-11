var express = require('express');
var mysql = require('../helper/mysql');

var login = express.Router();


/**Add admin**/
login.post('/',function(req,res){
	console.log("Login");
	if(!req.body.username || !req.body.password){
		res.status(400).json({
			status : 400,
			message : "Invalid Input"
		});
	}else{
		var uname = req.body.username;
		var upass = req.body.password;
		console.log("Login DB Call");
		mysql.query('Select userid from dbuser281.user_dtls_tbl where ??=? and ??=?',
				['username',uname,'password',upass],
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
	return login;
})();

