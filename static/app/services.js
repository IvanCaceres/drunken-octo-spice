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
Services.factory('Appointments', function(djResource){
  var resourceErrorHandler = function(error){
    console.log('AHHH ERROR')
    console.log(error)
  }
    return {
      post: function(business_location,services,when) { 
        return djResource('api/appointments/', {}, {
            post: {method:'POST', params:{}, isArray:true}
    }).post({availability:9,business_location: business_location, services:services, when:when, service_recipient: 2});
     }
    }
  });

Services.factory('User', function() {
	return {};
});
Services.factory('api', function(djResource){
        function add_auth_header(data, headersGetter){
            // as per HTTP authentication spec [1], credentials must be
            // encoded in base64. Lets use window.btoa [2]
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username +
                                        ':' + data.password));
        }
        // defining the endpoints. Note we escape url trailing dashes: Angular
        // strips unescaped trailing slashes. Problem as Django redirects urls
        // not ending in slashes to url that ends in slash for SEO reasons, unless
        // we tell Django not to [3]. This is a problem as the POST data cannot
        // be sent with the redirect. So we want Angular to not strip the slashes!
        return {
            auth: djResource('/api/auth\\/', {}, {
                login: {method: 'POST', transformRequest: add_auth_header},
                logout: {method: 'DELETE'}
            }),
            users: djResource('/api/users\\/', {}, {
                create: {method: 'POST'}
            })
        };
    });