module.exports = function($scope,$stateParams,AddressDetail, CarYears, CarModels, CarMakes, UserCars, Session, UserCarsService) {
    console.log('store detail scope')
    console.log($scope)
    console.log($stateParams)
    console.log($scope.$parent.map)
    $scope.data = {
    	services: [],
    	first_name: '',
    	last_name: '',
    	phone: '',
    	email: '',
    	description: ''
    };
	$scope.hours = [1,2,3,4,5,6,7,8,9,10,11,12];
	$scope.currentStep = 1;
	$scope.steps = [
					{
						id:1,
						collapse:false
					},
					{
						id:2,
						collapse:true
					},
					{
						id:3,
						collapse:true
					},
					{
						id:4,
						collapse:true
					}
					];

	$scope.CarMake = null;
	$scope.CarYear = null;				
					
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
		console.log('clicking hourrrrr');
		if($scope.data.hourSelected == hour){
			$scope.data.hourSelected = null;
		} else {
			$scope.data.hourSelected = hour;
		}
	};

	$scope.collapseDropdown = function (step) {
		console.log('you are clicking collapse DD', step, $scope.currentStep);
		if (step.id <= $scope.currentStep && step.isCollapsed == true) {
			console.log('is it trigginggg?G???');
			step.isCollapsed = false;				
		} else if (step.id <= $scope.currentStep && step.isCollapsed == false) {
			step.isCollapsed = true;
		}
	}

	$scope.updateCarModels = function(){
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

	$scope.saveCarSelection= function(){
		console.log('saving car selection!');
		if ($scope.CarModel) {
			$scope.data.carModel = $scope.CarModel;
		}
	}

	$scope.deleteCarSelection = function () {
		delete $scope.data.carModel;
	}

	$scope.nextStep = function (step) {
		console.log('show scope', $scope, step)
		if ($scope.validateStep(step.id)){
			step.isCollapsed = true;
			var nextStepScope = angular.element('.section-container:eq(' + step.id +')').scope();
			nextStepScope.step.isCollapsed = false;
			$scope.currentStep = step.id + 1;
			console.log('show me next step scope', nextStepScope);
		}
	}

	$scope.validateStep = function(stepId) {
		switch (stepId) {
			case 1:
				if ($scope.data.date){

				} else {
					alert('Please select a Day.');
					break;
				}
				if ($scope.data.hourSelected) {

				} else {
					alert('Please select an Hour');
					break;
				}
				return true;
			break;
			case 2:
				if ($scope.data.services.length > 0){

				} else {
					alert('Please choose a service');
					break;
				}
				return true;
			break;
			case 3:
				if ($scope.data.carModel){

				} else {
					alert('Please save a car');
					break;
				}
				return true;
			break;
			case 4:
				if ($scope.data.first_name.length > 1){

				} else {
					alert('please enter first name');
					break;
				}
				if ($scope.data.last_name.length > 1){
					
				} else {
					alert('please enter last name');
					break;
				}
				if ($scope.data.phone.length >= 7){

				} else {
					alert('please enter a phone number');
					break;
				}
				if ($scope.data.email.length > 1){
				} else {
					alert('please enter an email');
					break;
				}
				if ($scope.data.description.length > 1){

				} else {
					alert('please enter a description');
					break;
				}
				return true;
			break;	
		}	
	};

	$scope.updateServiceSelection = function(service) {
		console.log('calling update service selection show args', arguments);
		if(service.selected == true) {
			$scope.data.services.push(service.id);
		} else if (service.selected == false) {
			var index = $scope.data.services.indexOf(service.id);
			if (index > -1){
				$scope.data.services.splice(index, 1);
			}
		}
	}

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
