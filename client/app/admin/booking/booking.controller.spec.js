'use strict';

describe('Controller: BookingCtrl', function () {

  // load the controller's module
  beforeEach(module('rockataryApp'));

  var BookingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookingCtrl = $controller('BookingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
