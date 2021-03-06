angular.module( 'sample.home', [
'auth0'
])
.controller( 'HomeCtrl', function HomeController( $scope, auth, $http, $location, store, $rootScope ) {

  $scope.auth = auth;
console.log($rootScope.profile);
  $scope.callApi = function() {
    // Just call the API as you'd do using $http
    $http({
      url: 'http://localhost:3001/secured/ping',
      method: 'GET'
    }).then(function() {
      alert("We got the secured data successfully");
    }, function(response) {
      if (response.status == -1) {
        alert("Please download the API seed so that you can call it.");
      }
      else {
        alert(response.data);
      }
    });
  };

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  };

  $scope.getToken = function() {
    auth.getToken({
      targetClientId: 'frpoLFCvzss4uHw3XJs96YdnscaXPkuo',
      api: 'auth0'
    }).then(function (token) {
      console.log(token);
    }).catch(function(err) {
      console.log(err);
    });
  }

});
