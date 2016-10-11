var express = require('express');
var mysql = require('../helper/mysql');

var signup = express.Router();


/**Add admin**/
signup.post('/',function(req,res){
	console.log("SignUP");
	if(!req.body.email){
		res.status(400).json({
			status : 400,
			message : "Invalid Input"
		});
	}else{
		var email=req.body.email;
		var password=req.body.password;
		var fname=req.body.fname;
		var lname=req.body.lname;
		var pnumber=req.body.pnumber;
		var city=req.body.city;
		var state=req.body.state;
		var country=req.body.country;
		console.log("Inside signup db call");
		mysql.query('INSERT INTO dbuser281.user_dtls_tbl (??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)',
				['firstname','lastname','username','password','phone_number','city','state','country',fname,lname,email,password,pnumber,city,state,country],
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
						message : "User added"
					});
				}
			});
	}
});


module.exports = (function() {
	'use strict';
	return signup;
})();

