app.controller('ProfileCtrl', ['$rootScope','$scope','CarYears','CarModels','CarMakes','UserCars','Session','UserCarsService', function($rootScope,$scope,CarYears,CarModels,CarMakes,UserCars,Session, UserCarsService) {
// alert('test!');
$scope.user = $rootScope.user;

CarYears.query()
.$then(function(result){
	$scope.carYears = result.data;
	console.log($scope.carYears)
});
CarMakes.query()
.$then(function(result){
	$scope.carMakes = result.data;
	console.log($scope.carMakes)
});
UserCars.query(Session.userId)
.$then(function(result){
	console.log('got user cars')
	// $scope.userCars = result.data;
	UserCarsService.update(result.data);
	$scope.userCars = UserCarsService.data;
	console.log($scope.userCars)
});
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
	.$then(function(result){
		$scope.carModels = result.data;
	});
	}
}

$scope.userCarSave = function() {
	console.log(Session)
	console.log($scope.CarModel.id)
	UserCars.post(Session.userId, $scope.CarModel.id)
	.$then(function(result){
		console.log('post was successful')
		console.log(result)
		UserCars.query(Session.userId)
		.$then(function(result){
			$scope.userCars = result.data;
		});
	})
}
$scope.userCarDelete = function(userCar, $index) {
	
	var userCarId = userCar.id
	UserCars.delete(userCarId)
	.$then(function(result){
		console.log('deletion was successful')
		console.log(result)
		$scope.userCars.splice($index, 1);
	})
}
}]);