var mysql = require('mysql'), config = require('./config');
var db = config.db,
	poolConfig = config.dbPool,
	pool = [];
var conn;
/**
 * Method to create database
 */
function createConnection(){
	return mysql.createConnection({
		host : db.host,
		port : db.port,
		user : db.user,
		password : db.password,
		database : db.database,
		multipleStatements: true
	});
}

/**
 * Creating Connection Pool
 */
exports.createConnectionPool =function (){
	for(var i =0;i<poolConfig.maxSize;i++){
		pool.push(createConnection());
	}
};


/**
 * Function to get connection from pool
 * @returns connection
 */
function getConnectionFromPool(){
	if(pool.length<=0){
		console.log("Empty Pool");
		return null;
	}else{
		/*console.log("Pool length");
		console.log(pool.length);*/
		return pool.pop();
	}
}

/*
 * Function to query database w
*/
function queryDatabase(queryString, params, callback){
	var connection = getConnectionFromPool();
	if(connection){
			var sql = mysql.format(queryString, params);
			console.log(sql);
			connection.query(sql, function(err, rows, field) {
				if (err) {
					console.log(err);
					callback(err);
				} else {
					callback(null, rows);
				}
				pool.push(connection);
			});
		}
	else{
		console.log("No connection found");
	}
}

/**
 * Method to query database
 */
exports.query = function(queryString, params, callback) {
	console.log("Query Database");
	var sql 		= mysql.format(queryString, params);
	queryDatabase(queryString, params, callback);
};

exports.createSql = function (queryString, params){
	var sql = mysql.format(queryString, params);
	return sql;
};
