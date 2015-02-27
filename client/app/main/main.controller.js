'use strict';

angular.module('rockataryApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.posts = [];

    $http.get('/api/posts').success(function(posts) {
      $scope.posts = posts;
      socket.syncUpdates('post', $scope.posts);
    });
  });
