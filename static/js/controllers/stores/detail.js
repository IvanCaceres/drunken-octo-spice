module.exports = function($scope,$stateParams,AddressDetail) {
    console.log('store detail scope')
    console.log($scope)
    console.log($stateParams)
    console.log($scope.$parent.map)
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
