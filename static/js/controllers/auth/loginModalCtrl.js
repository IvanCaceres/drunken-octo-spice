module.exports = function($scope, $modalInstance, api, User, Session, USER_ROLES, $rootScope) {
    console.log('the login modal is now open');
    $scope.getCredentials = function(){
    	console.log('running getCredentials')
        return {username: $scope.username, password: angular.element('#pwd').val()};
            
    };
    $scope.login = function(){
          console.log('running login function')
            api.auth.login($scope.getCredentials()).
                $promise.then(function(data){
                      console.log(data)
                      console.log('triggered the then signalling data is good')
                        // on good username and password
                        $scope.$root.user = $scope.username;
                        console.log($scope)
                        Session.create(User.authAttributes.session, data.id, USER_ROLES.all);
                    console.log('triyng to dismiss modal')
                    console.log($modalInstance)
                    $modalInstance.dismiss('authenticated');
                    }).
                    catch(function(data){
                        // on incorrect username and password
                        console.log(data)
                        alert(data.data.detail);
                    });
    };
};
