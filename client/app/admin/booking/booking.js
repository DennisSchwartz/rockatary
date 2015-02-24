'use strict';

angular.module('rockataryApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('booking', {
        url: '/admin/booking',
        templateUrl: 'app/admin/booking/booking.html',
        controller: 'AdminCtrl',
        authenticate: true
      })
      .state('booking.gigs', {
      	url: '/gigs',
      	templateUrl: 'app/admin/booking/booking.gigs.html',
      	controller: 'AdminCtrl',
      	authenticate: true
      })
      .state('booking.gigs.detail', {
      	url: '/detail/:id',
      	templateUrl: 'app/admin/booking/booking.gigs.detail.html',
      	controller: 'BookingCtrl',
      	authenticate: true
      });
  });