module.exports = function($rootScope,$scope,CarYears,CarModels,CarMakes,UserCars,Session, UserCarsService, Appointments) {
// alert('test!');
    $scope.user = $rootScope.user;
    CarYears.query()
        .$promise.then(function(result){
            $scope.carYears = result;
            console.log($scope.carYears)
        });
    CarMakes.query()
        .$promise.then(function(result){
            $scope.carMakes = result;
            console.log($scope.carMakes)
        });
    UserCars.query(Session.userId)
        .$promise.then(function(result){
            console.log(result)
            console.log('got user cars')
            // $scope.userCars = result.data;
            UserCarsService.update(result);
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
                .$promise.then(function(result){
                    $scope.carModels = result;
                });
        }
    }

    $scope.userCarSave = function() {
        console.log(Session)
        console.log($scope.CarModel.id)
        UserCars.post(Session.userId, $scope.CarModel.id)
            .$promise.then(function(result){
                console.log('post was successful')
                console.log(result)
                UserCars.query(Session.userId)
                    .$promise.then(function(result){
                        $scope.userCars = result;
                    });
            })
    }

    $scope.userCarDelete = function(userCar, $index) {

        var userCarId = userCar.id;
        UserCars.delete(userCarId)
            .$promise.then(function(result){
                console.log('deletion was successful')
                console.log(result)
                $scope.userCars.splice($index, 1);
            })
    }

    $scope.getAppointments = function() {
        Appointments.query(Session.userId)
        .$promise.then(function(result){
            console.log('dude we got the appointments show me them', result);
            for(var i=0;i<result.length;i++){
                result[i].date_string = moment(result[i].when).format('MM/DD/YY [at] HH:mm A');
            }
            $scope.appointments = result;
        });
    }
    $scope.getAppointments();

};