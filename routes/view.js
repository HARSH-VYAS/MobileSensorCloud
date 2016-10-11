var express = require('express');

var viewsRoute = express.Router();

viewsRoute.get(['/','/home'], function(req, res) {
	res.render('index');
});


viewsRoute.get('/partials/login', function(req, res) {
	res.render('partials/login');
});

viewsRoute.get('/partials/home', function(req, res) {
	res.render('partials/home');
});

viewsRoute.get('/partials/admin', function(req, res) {
	res.render('partials/admin');
});


module.exports = (function() {
	'use strict';
	return viewsRoute;
})();