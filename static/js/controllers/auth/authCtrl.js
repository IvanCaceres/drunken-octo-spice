module.exports = function($scope, $state, api, Session, USER_ROLES, User, $modal) {
 User.authAttributes = angular.element('.authAttribs').data()
  console.log('elem:')
  console.log(User.authAttributes)
  //console.log('logging rootScope')
  //console.log($rootScope)
  if(User.authAttributes.user){
    Session.create(User.authAttributes.session, User.authAttributes.userid, USER_ROLES.all)
  }
        // var $scope = $rootScope;
        // Angular does not detect auto-fill or auto-complete. If the browser
        // autofills "username", Angular will be unaware of this and think
        // the $scope.username is blank. To workaround this we use the 
        // autofill-event polyfill [4][5]
        // $('#id_auth_form input').checkAndTriggerAutoFillEvent();
 
        

        $scope.openLoginModal = function(){
            console.log('you are clicking open login modal')
                var modalInstance = $modal.open({
                    templateUrl: '/static/js/templates/modals/login.html',
                    controller: 'loginModalController',
                    size: 'sm',
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
        };

        
 
        $scope.logout = function(){
            api.auth.logout(function(){
                $scope.$root.user = undefined;
            });
            $state.go('home')
        };
        $scope.register = function($event){
            // prevent login form from firing
            $event.preventDefault();
            // create user and immediatly login on success
            api.users.create($scope.getCredentials()).
                $then($scope.login).
                    catch(function(data){

                    });
            };
};