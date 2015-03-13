'use strict';

angular.module('rockataryApp')
  .controller('BookingCtrl', function ($scope, $http, $stateParams) {
    $scope.gigId = $stateParams.id;
    $scope.event = {};
    $scope.event.type = "Gig";

    $scope.createEvent = function() {
    	console.log('create Function called!');
    	if ( $scope.event.type == 'Gig' ) {
    		// Remove the endDate from the form
    		$scope.event.endDate = undefined;
    		// SEND POST REQUEST TO /api/gigs/
    		$http.post('/api/gigs', $scope.event).success(function(data, status) {
    			//Do sth. when post successful
    			console.log('successful post!');
                $state.go('booking.gigs', { 'activeGig': 'undefined', 'alertMessage': 'Added Gig!'});
    			console.log(data);
    			console.log(status);
    		}).error(function(err) {
    			//Handle error
    			console.log('Couldn\'t save current gig!');
    			console.log(err.message);
    		});
    	}
    	if ($scope.event.type == 'privater Termin') {
    		console.log($scope.event);
    	}
    }
  });
