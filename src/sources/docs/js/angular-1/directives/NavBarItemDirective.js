let NavBarDirective = function($scope) {
    if ($scope.item.request) {
        $scope.method_lc = $scope.item.request.method.toLowerCase();
    }
};

module.exports = () => {
    return {
        scope: {
            'item': '='
        },
        controller: [
            '$scope',
            NavBarDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/navbar-item.html'
    }
};