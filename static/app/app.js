'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router',
  'djangoRESTResources',
  'myApp.home',
  'AppServices',
  'ui.bootstrap.datetimepicker',
  'ui.bootstrap'
])
// config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/view1'});
// }]);
// config(function($routeProvider, $locationProvider) {

// 		$routeProvider
// 			.when('/', {
// 				templateUrl : '/static/app/home/home.html',

// 			})
// 			.when('/about', {
// 				templateUrl : '/static/app/view1/view1.html',
// 			})
// 			.when('/contact', {
// 				templateUrl : 'partials/contact.html',
// 			}).when('/customizer', {
// 				templateUrl : '/static/app/customizer/select.html',
// 			}).when('/customizer/select', {
// 				templateUrl : '/static/app/customizer/select.html',
// 			}).when('/tables/type', {
// 				templateUrl : '/static/app/tables/type.html',
// 			}).otherwise({
//                 redirectTo : '/'
//             });

	
// 		// use the HTML5 History API
// 		$locationProvider.html5Mode(true);
// 	});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, USER_ROLES) {
  // django and angular both support csrf tokens. This tells
        // angular which cookie to add to what header.
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  //
  //
  // Now set up the states
  $stateProvider
  .state('home', {
      url: "/",
      templateUrl: "/static/app/home/home.html",
      controller: 'HomeCtrl',
      data: {
      authorizedRoles: [USER_ROLES.all, USER_ROLES.guest, USER_ROLES.admin, USER_ROLES.editor]
      } 
    })
    .state('stores', {
      url: "/stores/",
      templateUrl: "/static/app/home/search.html",
      controller: 'StoreMapCtrl',
      data: {
      authorizedRoles: [USER_ROLES.all, USER_ROLES.guest, USER_ROLES.admin, USER_ROLES.editor]
      } 
    })
    .state('profile', {
      url: "/profile/",
      templateUrl: "/static/app/user/profile.html",
      controller: 'ProfileCtrl',
      data: {
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.all]
      } 
    })
        
    // .state('customizer', {
    //   url: "/customizer/",
    //   templateUrl: "/static/app/customizer/select.html",
    //   controller: 'CustomizerCtrl'
    // })
    // .state('customizer.type', {
    //   url: ":type/",
    //   views:{
    //            "content":{
    //             templateUrl: "/static/app/customizer/type.html",
    //             controller: 'CustomizerTypeCtrl'
    //             }
    //        },
      
    // })
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
    //use the HTML5 History API
		$locationProvider.html5Mode(true);
})
app.run(function ($rootScope, AUTH_EVENTS, AuthService, Session, USER_ROLES) {
if($rootScope.user){
  alert('asdasdzxczxczxczxczxczxc')
}
  console.log(USER_ROLES)
    Session.create('default','guest',USER_ROLES.guest)
      console.log(Session)
  $rootScope.$on('$stateChangeStart', function (event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {

        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
})
// angular.module('authApp', ['ngResource']).
//     config(['$httpProvider', function($httpProvider){
//         // django and angular both support csrf tokens. This tells
//         // angular which cookie to add to what header.
//         $httpProvider.defaults.xsrfCookieName = 'csrftoken';
//         $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
//     }]).
//     factory('api', function($resource){
//         function add_auth_header(data, headersGetter){
//             // as per HTTP authentication spec [1], credentials must be
//             // encoded in base64. Lets use window.btoa [2]
//             var headers = headersGetter();
//             headers['Authorization'] = ('Basic ' + btoa(data.username +
//                                         ':' + data.password));
//         }
//         // defining the endpoints. Note we escape url trailing dashes: Angular
//         // strips unescaped trailing slashes. Problem as Django redirects urls
//         // not ending in slashes to url that ends in slash for SEO reasons, unless
//         // we tell Django not to [3]. This is a problem as the POST data cannot
//         // be sent with the redirect. So we want Angular to not strip the slashes!
//         return {
//             auth: $resource('/api/auth\\/', {}, {
//                 login: {method: 'POST', transformRequest: add_auth_header},
//                 logout: {method: 'DELETE'}
//             }),
//             users: $resource('/api/users\\/', {}, {
//                 create: {method: 'POST'}
//             })
//         };
//     }).
//     controller('authController', function($scope, api) {
//         // Angular does not detect auto-fill or auto-complete. If the browser
//         // autofills "username", Angular will be unaware of this and think
//         // the $scope.username is blank. To workaround this we use the 
//         // autofill-event polyfill [4][5]
//         $('#id_auth_form input').checkAndTriggerAutoFillEvent();
 
//         $scope.getCredentials = function(){
//             return {username: $scope.username, password: $scope.password};
//         };
 
//         $scope.login = function(){
//             api.auth.login($scope.getCredentials()).
//                 $promise.
//                     then(function(data){
//                         // on good username and password
//                         $scope.user = data.username;
//                     }).
//                     catch(function(data){
//                         // on incorrect username and password
//                         alert(data.data.detail);
//                     });
//         };
 
//         $scope.logout = function(){
//             api.auth.logout(function(){
//                 $scope.user = undefined;
//             });
//         };
//         $scope.register = function($event){
//             // prevent login form from firing
//             $event.preventDefault();
//             // create user and immediatly login on success
//             api.users.create($scope.getCredentials()).
//                 $promise.
//                     then($scope.login).
//                     catch(function(data){
//                         alert(data.data.username);
//                     });
//             };
//     });
 
// // [1] https://tools.ietf.org/html/rfc2617
// // [2] https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
// // [3] https://docs.djangoproject.com/en/dev/ref/settings/#append-slash
// // [4] https://github.com/tbosch/autofill-event
// // [5] http://remysharp.com/2010/10/08/what-is-a-polyfill/