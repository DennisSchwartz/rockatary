'use strict';

angular.module('rockataryApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.gigs = [];

    $http.get('/api/gigs').success(function(gigs) {
      $scope.gigs = gigs;
      socket.syncUpdates('gig', $scope.gigs);
    });

    $scope.addGig = function() {
      if($scope.newTitle === '') {
        return;
      }
      $http.post('/api/gigs', { title: $scope.newTitle,
                                location: $scope.newLoc });
      $scope.newTitle = '';
      $scope.newLoc = '';
    };

    $scope.deleteGig = function(gig) {
      $http.delete('/api/gigs/' + gig._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('gig');
    });
  });
