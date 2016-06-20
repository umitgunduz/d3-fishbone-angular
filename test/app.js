var app = angular.module('app', ['fishbone']);

app.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.data = null;
    $http.get('data.json').success(function(data) {
        $scope.data = data;
    });
}]);
