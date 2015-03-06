'use strict';

angular.module('rockataryApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket, $filter, FileUploader) {

    $scope.gigs = [];
    $scope.posts = [];
    $scope.activeGig = false;
    $scope.orderProp = '-date';
    $scope.uploader = new FileUploader({
            url: 'api/files/upload/'
        });

    $http.get('/api/gigs').success(function(gigs) {
      $scope.gigs = gigs;
      socket.syncUpdates('gig', $scope.gigs);
    });

    $http.get('/api/posts').success(function(posts) {
      $scope.posts = posts;
      socket.syncUpdates('newsItem', $scope.posts);
    });

    $scope.toggleGigDetail = function(gig) {
      if ($scope.activeGig) {
        $scope.activeGig = false;
        console.log("Active gig unset!");
      } else {
        $scope.activeGig = $filter('filter')($scope.gigs, function (d) {return d._id === gig._id;})[0];
        console.log("Active gig set to " + $scope.activeGig.title);
      }
    };

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
