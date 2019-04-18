let ExampleRequests = function($scope) {
    $scope.tabs = {
        activeKey: 0
    };
};

module.exports = () => {
    return {
        scope: {
            'responses': '='
        },
        controller: [
            '$scope',
            ExampleRequests
        ],
        replace: true,
        templateUrl: './assets/tpl/example-responses.html'
    }
};