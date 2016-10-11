/**Angular module**/
var MobileSensor = angular.module("MobileSensor", [ 'ngRoute', 'ui.bootstrap','ngTable', 'checklist-model', 'chart.js'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl : '/partials/login',
		controller : 'userController'
	}).when('/home', {
		templateUrl : '/partials/home',
		controller : 'userController'
	}).when('/admin', {
		templateUrl : '/partials/admin',
		controller : 'userController'
	}).otherwise({
		redirectTo : '/'
	});
	
	/**to remove hash in the URL**/
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});

}).config( ['$anchorScrollProvider', 
            function($anchorScrollProvider) {
    $anchorScrollProvider.disableAutoScrolling();
}]
).run(['$rootScope','$window' ,'$location','$http','$templateCache',function($rootScope,$window, $location,$http,$templateCache) {
	
	$rootScope.$on('$routeChangeStart', function(event,next, current) {
		
		if($window.sessionStorage.userid){
			$http.defaults.headers.common.Authorization = $window.sessionStorage.userid;
			if($window.sessionStorage.userid == 1)
			{
				$location.path('/admin');
			}
		}else{
			$location.path('/');
		}
	});
}]);


MobileSensor.controller("userController", function($scope, $modal, $interval, $filter, ngTableParams, DataService, $http, $location, $window, $rootScope) {
	
	$scope.sensoridlist = [];
	
	$scope.getHomePage = function(){
		$location.path('/home');
	};
	
	  $scope.checkAll = function() {
		    $scope.sensoridlist = angular.copy($scope.usersensoridlist);
		  };
		  
	  $scope.uncheckAll = function() {
	    $scope.sensoridlist = [];
	  };
	
	//$scope.userName = "Pankaj";
	
	$scope.changeTemplateURL = function(templateUrl){
		
		console.log("templateUrl : " + templateUrl);

		$scope.templateurl = templateUrl;

	};
	
	$scope.getSensorInfo = function(){
		
		//$scope.sensoridlist = [];
		$scope.usersensoridlist = [];
		
		console.log("Inside getSensorInfo");
		
		var params = {
				userid	: $window.sessionStorage.userid
		};
		DataService.postData("/api/sensor_user",params).success(function(res){
			console.log("Sensor info for user");
			console.log(res);
			var data = res.message;
			
			for(var i=0; i<data.length; i++)
			{
				$scope.usersensoridlist.push(data[i].sensorId);
			}
			
			//console.log("usersensoridlist : " + $scope.usersensoridlist);
			
			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					sensorid: ''       // initial filter
				},
				sorting: {
					sensorid: ''     // initial sorting
				}
		}, {
				total: data.length, // length of data
				getData: function($defer, params) {
						// use build-in angular filter
						var filteredData = params.filter() ?
										$filter('filter')(data, params.filter()) :
										data;
						var orderedData = params.sorting() ?
										$filter('orderBy')(filteredData, params.orderBy()) :
										data;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
		});
			
		}).error(function(err){
			console.log(err.message);
		});
		
	};
	
	
	
	$scope.getSensorData = function(){
	$interval(function(){
		
		console.log("Inside getSensorData");
		console.log("$scope.user : " + $scope.sensoridlist);
		
		var params = {
				sensorids	: $scope.sensoridlist
		};
		
		DataService.postData("/api/sensor_data",params).success(function(res){
			console.log("Sensor data for user");
			console.log(res);
			var data = res.message;
			$scope.sensorgraph = [];
			for(var i=0; i<data.length; i++)
			{
				var graph = {"labels":"", "series":"", "data":"", "onClick": ""};
				graph.labels = data[i].Time.split(',');
				graph.series = [data[i].name];
				graph.data = [data[i].Data.split(',')];
				$scope.sensorgraph.push(graph);
			}
			
			  //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
			  //console.log("data[0].Time : " + JSON.stringify(data[0].Time));
			  //$scope.labels = data[0].Time.split(',');
			  //$scope.series = ['Series A'];
			  //$scope.data = [data[0].Data.split(',')];
			  $scope.onClick = function (points, evt) {
			    console.log(points, evt);
			  };
			  
	        $scope.$on('$destroy', function() {
	            // Make sure that the interval is destroyed too
	            $scope.stopFight();
	          });
	        
	        $scope.stopFight = function() {
	            if (angular.isDefined(stop)) {
	              $interval.cancel(stop);
	              stop = undefined;
	            }
	          };
			
			
		}).error(function(err){
			console.log(err.message);
		});
	},5000);
	};
	
	//SELECT  sensor_id,sensor_type,name, SUBSTRING_INDEX(group_concat(timestamp order by timestamp desc),',',2) as TIme, SUBSTRING_INDEX(group_concat(data order by timestamp desc),',',2) as Data
	//FROM dbuser281.Sensor_data where sensor_id in (37) group by sensor_id;
	

	
	$scope.manageSensor = function(sensorID, action){
		//console.log("Starting Sensor" + sensorID);
		//console.log("Sensor Action" + action);
		if(sensorID != "" || action != "")
		{
			var params = {
					sensorid : sensorID,
					m_action : action,
					userid : $window.sessionStorage.userid
			};
			
			DataService.postData("/api/manage_sensor",params).success(function(res){
				console.log(res);
				$location.path('/home');
						
			}).error(function(err){
				console.log(err.message);
			});
		}

	};
	
	
	$scope.getBillingInfo = function(){
		
		console.log("Inside getBillingInfo");
		
		var params = {
				userid	: $window.sessionStorage.userid
		};
		DataService.postData("/api/billing_user",params).success(function(res){
			console.log("Billing info for user");
			console.log(res);
			var bill_data = res.message;
			var t_bill = 0;
			
			//Total Bill
			for(var i=0; i<bill_data.length; i++)
			{
				console.log(bill_data[i].usagecount * bill_data[i].sensorprice);
				t_bill += (bill_data[i].usagecount * bill_data[i].sensorprice);
			}
			
			$scope.total_bill = t_bill;
			
			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					sensorName: ''       // initial filter
				},
				sorting: {
					sensorName: ''     // initial sorting
				}
		}, {
				total: bill_data.length, // length of data
				getData: function($defer, params) {
						// use build-in angular filter
						var filteredData = params.filter() ?
										$filter('filter')(bill_data, params.filter()) :
										bill_data;
						var orderedData = params.sorting() ?
										$filter('orderBy')(filteredData, params.orderBy()) :
										bill_data;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
		});
			
		}).error(function(err){
			console.log(err.message);
		});
		
	};
	
	$scope.createSensor = function(){
		var modalInstance = $modal.open({
			templateUrl : 'templates/createSensor.html',
			controller : 'sensorCreate',
			size : 'lg',
			resolve : {
			}
		});
		/**modal close callback**/
		modalInstance.result.then(function(valid) {
			if(valid){
				$location.path('/home');
			}
		}, function() {
			$location.path('/home');
		});
	};
	
	$scope.signUp = function(){
		var modalInstance = $modal.open({
			templateUrl : 'templates/signUP.html',
			controller : 'signup',
			size : 'lg',
			resolve : {
			}
		});
		/**modal close callback**/
		modalInstance.result.then(function(valid) {
			if(valid){
				$location.path('/');
			}
		}, function() {
			$location.path('/');
		});
	};

	
	$scope.Login = function(){
		//console.log($scope.user_email);
		//console.log($scope.user_password);
		
		var params = {
				username : $scope.user_email,
				password : $scope.user_password
		};
		DataService.postData("/api/login",params).success(function(res){
			//console.log("response : " + JSON.stringify(res.message[0].userid));
			$window.sessionStorage.userid = res.message[0].userid;
			$location.path('/home');
		}).error(function(err){
			console.log(err.message);
		});
	};
	
	$scope.Logout = function(){
			delete $window.sessionStorage.userid;
			$location.path('/');
	};
	

	$scope.createController = function(){
		var params = {
		};
		DataService.postData("/api/create_controller",params).success(function(res){
			//console.log("response : " + JSON.stringify(res.message[0].userid));
			$location.path('/admin');
		}).error(function(err){
			console.log(err.message);
		});
	};
	
	$scope.Logout = function(){
			delete $window.sessionStorage.userid;
			$location.path('/');
	};
	
	
	//Admin
	
	$scope.getInstanceInfo = function(){
		
		console.log("Inside getInstanceInfo");
		
		var params = {
				userid	: $window.sessionStorage.userid
		};
		DataService.postData("/api/instance_info",params).success(function(res){
			console.log("Instance info");
			console.log(res);
			var data = res.message;
			
			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					sensorid: ''       // initial filter
				},
				sorting: {
					sensorid: ''     // initial sorting
				}
		}, {
				total: data.length, // length of data
				getData: function($defer, params) {
						// use build-in angular filter
						var filteredData = params.filter() ?
										$filter('filter')(data, params.filter()) :
										data;
						var orderedData = params.sorting() ?
										$filter('orderBy')(filteredData, params.orderBy()) :
										data;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
		});
			
		}).error(function(err){
			console.log(err.message);
		});
		
	};

});




MobileSensor.controller("sensorCreate", function($scope, $modalInstance, $interval, $filter, ngTableParams, DataService, $http, $location, $window, $rootScope) {

	$scope.sensor_type = "Temperature";
	$scope.sensor_name = "";

	$scope.setSensorType = function(type){
	
		$scope.sensor_type = type;
	
	};
			
			
	$scope.ok = function() {
		
		//console.log($scope.sensor_name);
		//console.log($scope.sensor_type);
		if($scope.sensor_type != "" || $scope.sensor_name != "")
		{
			var params = {
					name : $scope.sensor_name,
					type : $scope.sensor_type,
					userid : $window.sessionStorage.userid
			};
			
			DataService.postData("/api/create_sensor",params).success(function(res){
				console.log(res);
				$modalInstance.dismiss();
						
			}).error(function(err){
				console.log(err.message);
			});
		}

		
		
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
	
	
});


MobileSensor.controller("signup", function($scope, $modalInstance, $interval, $filter, ngTableParams, DataService, $http, $location, $window, $rootScope) {

	$scope.sensor_type = "Temperature";
	$scope.sensor_name = "";

	$scope.setSensorType = function(type){
	
		$scope.sensor_type = type;
	
	};
			
			
	$scope.ok = function() {
		
		//console.log($scope.sensor_name);
		//console.log($scope.sensor_type);
		if($scope.sensor_type != "" || $scope.sensor_name != "")
		{
			var params = {
					email : $scope.email,
					password : $scope.password,
					fname : $scope.fname,
					lname : $scope.lname,
					pnumber : $scope.pnumber,
					city : $scope.city,
					state : $scope.state,
					country : $scope.country
			};
			
			DataService.postData("/api/signup",params).success(function(res){
				console.log(res);
				$modalInstance.dismiss();
						
			}).error(function(err){
				console.log(err.message);
			});
		}

		
		
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
	
	
});