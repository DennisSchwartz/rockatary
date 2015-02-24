'use strict';

angular.module('rockataryApp')
  .controller('BookingCtrl', function ($scope, $stateParams) {
    $scope.gigId = $stateParams.id;
  });
