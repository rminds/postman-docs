let app = angular.module('docsApp', []);

app.controller('BaseController', [
    '$scope',
    function($scope) {
        console.log('$scope');
    }
]);