'use strict';

angular.module('rockataryApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket, $filter, $upload) {

    $scope.gigs = [];
    $scope.posts = [];
    $scope.activeGig = false;
    $scope.orderProp = '-date';
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.errorMessage = '';
    //$scope.uploader = new FileUploader({
    //        url: 'api/files/upload/'
    //    });

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    var upload = $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/files/upload/',
                    file: file

                }).progress(function (evt) {

                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);

                }).success(function (data, status, headers, config) {

                    console.log('file ' + config + ' uploaded. Response: ' + data.fileID);
                    $scope.activeGig.pics = $scope.activeGig.pics.concat(data.fileID);
                    console.log('Gig: ' + angular.toJson($scope.activeGig));

                    //After upload, connect file to a gig
                    $http.put('api/gigs/' + $scope.activeGig._id, $scope.activeGig).
                      success(function(data, status, headers, config) {
                        console.log('Data: ' + angular.toJson(data));
                      }).
                      error(function(data, status, headers, config) {
                        console.log('Error!: ' + data);
                      });

                }).error(function (err) {
                    $scope.errorMessage = err.message;
                    console.log('something went wrong!');
                    console.log($scope.errorMessage);
                });
            }
        }
    };

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
