var Services = angular.module('AppServices', ['djangoRESTResources']);

Services.factory('BusinessTypes', function(djResource){
    return {
      query: function() { 
        return djResource('api/type/', {}, {
            query: {method:'GET', params:{format:'json'}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('Businesses', function(djResource){
    return {
      query: function() { 
        return djResource('api/business/', {}, {
            query: {method:'GET', params:{format:'json'}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('Services', function(djResource){
    return {
      query: function(name) { 
        return djResource('api/services/', {}, {
            query: {method:'GET', params:{format:'json',name:name}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('CustomizerProperties', function(djResource){
    return {
    	query: function(furnituretypeID) { 
    		return djResource('/api/properties/', {}, {
      			query: {method:'GET', params:{format:'json', furniture_type: furnituretypeID }, isArray:true}
    }).query();
     }
    }
  });

Services.factory('Addresses', function(djResource){
    return {
    	query: function(distanceParam, locationParam, date, businessTypeID) { 
    		return djResource('/api/address/', {}, {
      			query: {method:'GET', params:{format:'json', business_type: businessTypeID||'none', distance: distanceParam, location: locationParam, date:date }, isArray:true}
    }).query();
     }
    }
  });

Services.factory('Availability', function(djResource){
    return {
      query: function(when, business_ids) { 
        return djResource('/api/availability/', {}, {
            query: {method:'GET', params:{format:'json', when: when, business_id: business_ids}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('CarYears', function(djResource){
    return {
      query: function() { 
        return djResource('/api/car/years/', {}, {
            query: {method:'GET', params:{format:'json'}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('CarModels', function(djResource){
    return {
      query: function(year, make) { 
        return djResource('/api/car/models/', {}, {
            query: {method:'GET', params:{format:'json', year: year, make: make}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('CarMakes', function(djResource){
    return {
      query: function() { 
        return djResource('/api/car/makes/', {}, {
            query: {method:'GET', params:{format:'json'}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('reverseGeocode', function(djResource){
    return {
      query: function(latlng) { 
        return djResource('https://maps.googleapis.com/maps/api/geocode/json', {}, {
            query: {method:'JSONP', params:{latlng:latlng, callback:'JSON_CALLBACK'}, isArray:false}
    }).query();
     }
    }
  });
Services.factory('Appointments', function(djResource){
  var resourceErrorHandler = function(error){
    console.log('AHHH ERROR')
    console.log(error)
  }
    return {
      post: function(business_location,services,when,cars) { 
        return djResource('api/appointments/', {}, {
            post: {method:'POST', params:{}, isArray:false}
    }).post({availability:9,business_location: business_location, services:services, when:when, service_recipient: 2, cars:cars});
     }
    }
  });

Services.factory('UserCars', function(djResource){
    return {
      post: function(user,model) { 
        return djResource('api/car/users/', {}, {
            post: {method:'POST', params:{}, isArray:true}
    }).post({user:user,model:model});
     },
     query: function(user) { 
        return djResource('api/car/userlist/', {}, {
            query: {method:'GET', params:{user:user}, isArray:true}
    }).query();
     },
     delete: function(userCarId) { 
        return djResource('api/car/users/:id/', {id: userCarId}, {
            delete: {method:'DELETE', params:{}, isArray:true}
    }).delete();
     }
    }
  });

Services.factory('User', function() {
	return {};
});
Services.factory('api', function(djResource){
        function add_auth_header(data, headersGetter){
          console.log('auth header data')
          console.log(data)
            // as per HTTP authentication spec [1], credentials must be
            // encoded in base64. Lets use window.btoa [2]
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username +
                                        ':' + data.password));
            console.log(headers)
        }
        // defining the endpoints. Note we escape url trailing dashes: Angular
        // strips unescaped trailing slashes. Problem as Django redirects urls
        // not ending in slashes to url that ends in slash for SEO reasons, unless
        // we tell Django not to [3]. This is a problem as the POST data cannot
        // be sent with the redirect. So we want Angular to not strip the slashes!
        return {
            auth: djResource('/api/auth/', {}, {
                login: {method: 'POST', transformRequest: add_auth_header},
                logout: {method: 'DELETE'}
            }),
            users: djResource('/api/users/', {}, {
                create: {method: 'POST'}
            })
        };
    });

Services.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

Services.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
});
Services.factory('AuthService', function ($http, Session) {
  var authService = {};
 
  authService.login = function (credentials) {
    return $http
      .post('/login', credentials)
      .then(function (res) {
        Session.create(res.data.id, res.data.user.id,
                       res.data.user.role);
        return res.data.user;
      });
  };
 
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
});
Services.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    console.log('running create:')
    console.log(sessionId)
    console.log(userId)
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
  return this;
});
Services.service('UserCarsService', function ($modal,UserCars){
  var UserCarsService = this;
  this.update = function(data){
    this.data = data;
  }
  this.get = function(user){
    console.log(UserCarsService)
    UserCarsService.request = UserCars.query(user)
    .$then(function(result){
      UserCarsService.update(result.data);
    });
  }
  this.chooseCar = function(business){
        var modalInstance = $modal.open({
      templateUrl: '/static/app/modals/chooseCar.html',
      controller: 'chooseCarCtrl',
      size: 'sm',
      resolve: {
        business: function () {
          console.log('showing the business that was fed in resolve')
          console.log(business)
          return business;
        }
      }
    });
    return modalInstance;
  }
  this.setSelected = function(selected){
    UserCarsService.selected = selected;
  }
  return this;  
}); 