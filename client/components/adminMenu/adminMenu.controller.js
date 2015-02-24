'use strict';

angular.module('rockataryApp')
  .controller('AdminMenuCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Gigs',
      'link': '.gigs'
    },{
      'title': 'News',
      'link': '/booking/news'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });