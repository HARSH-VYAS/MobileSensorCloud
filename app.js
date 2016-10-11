
/**
 * Module dependencies.
 */

var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	mysql = require('./helper/mysql');
	//http = require('http');


var viewRoute = require('./routes/view');
	apiRoute = require('./routes/api');
	
mysql.createConnectionPool();	

var app = express();

//view engine setup
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(function(req,res,next){
	if(req.url === "/" || req.url === "/partials/login" || req.url === "/partials/admin" || req.url === "/home" || req.url === "/partials/home" || req.url === "/api/login" || req.url === "/api/create_controller" || req.url === "/api/instance_info" || req.url === "/api/signup" || req.url === "/api/create_sensor" || req.url === "/api/manage_sensor" || req.url === "/api/billing_user" || req.url === "/api/sensor_user" || req.url === "/api/sensor_data"){
		next();
	}else{
			console.log("err 56");
			//res.render("error");
		}
});



app.use('/',viewRoute);
app.use('/api',apiRoute);


//catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log("err 91");
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.log("err 103");
		res.status(err.status || 500);
		//res.render('error');
	});
}

//production error handler
//no stack traces leaked to user
app.use(function(err, req, res, next) {
	console.log("err 112");
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});

app.listen(8000,function(){
	console.log("Mobile Sensor Clinet Started ... ");
});

module.exports = app;