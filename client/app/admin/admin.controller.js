'use strict';

angular.module('rockataryApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {

    $scope.gigs = [];
    $scope.posts = [];

    $http.get('/api/gigs').success(function(gigs) {
      $scope.gigs = gigs;
      socket.syncUpdates('gig', $scope.gigs);
    });

    $http.get('/api/posts').success(function(posts) {
      $scope.posts = posts;
      socket.syncUpdates('newsItem', $scope.posts);
    });


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
