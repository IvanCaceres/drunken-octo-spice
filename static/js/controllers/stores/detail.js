module.exports = function($scope,$stateParams,AddressDetail, CarYears, CarModels, CarMakes, UserCars, Session, UserCarsService) {
    console.log('store detail scope')
    console.log($scope)
    console.log($stateParams)
    console.log($scope.$parent.map)
	$scope.hours = [1,2,3,4,5,6,7,8,9,10,11,12];

	//grab car model data
	CarYears.query()
	.$promise.then(function(result){
		$scope.carYears = result;
	});
	CarMakes.query()
	.$promise.then(function(result){
			$scope.carMakes = result;
	});

	$scope.clickHour = function (hour) {
		if($scope.hourSelected == hour){
			$scope.hourSelected = null;
		} else {
			$scope.hourSelected = hour;
		}
	};

	//watch for CarMake & Year dropdown changes
	$scope.$watch('CarMake', function() {
		updateCarModels()
	});
	$scope.$watch('CarYear', function() {
		updateCarModels()
	});

	var updateCarModels = function (){
		console.log('CarMake:')
		console.log($scope.CarMake)
		console.log('CarYear:')
		console.log($scope.CarYear)
		if($scope.CarYear && $scope.CarMake){
			CarModels.query($scope.CarYear.id, $scope.CarMake.id)
				.$promise.then(function(result){
					$scope.carModels = result;
				});
		}
	};

	if($scope.$parent.map.stores.$promise){
		console.log('we found the map stores ');
		$scope.$parent.map.stores.$promise.then(function(result){
			console.log('weve got stores')
			for(var i=0;i<$scope.$parent.map.stores.length;i++){
				console.log('looping through stores')
				if($scope.$parent.map.stores[i].id === parseInt($stateParams.id)){
					$scope.store = $scope.$parent.map.stores[i];
					console.log('dumping store scope', $scope.store);
					$scope.storeMap = {};
					$scope.storeMap.center = {
						latitude: $scope.store.lat
						, longitude: $scope.store.long
					};
					$scope.storeMap.zoom = 16;
					$scope.storeMap.marker = [];
					$scope.storeMap.marker.push($scope.store);
					console.log($scope)
				}
			}
		});
	} else {
		var storeId = parseInt($stateParams.id);
		AddressDetail.query(storeId)
		.$promise.then(function(result){
			console.log('got the individual store', result);
			$scope.store = result;
			$scope.storeMap = {};
			$scope.storeMap.center = {
				latitude: $scope.store.lat
				, longitude: $scope.store.long
			};
			$scope.store.coords = {
				latitude: $scope.store.lat,
				longitude: $scope.store.long,
				title: 'm0'
			};
			$scope.storeMap.zoom = 16;
			$scope.storeMap.marker = [];
			$scope.storeMap.marker.push($scope.store);
		});
	}

};
