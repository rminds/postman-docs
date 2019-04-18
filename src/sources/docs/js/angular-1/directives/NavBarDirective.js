let NavBarDirective = function($scope) {
    
};

module.exports = () => {
    return {
        scope: {
            'data': '='
        },
        controller: [
            '$scope',
            NavBarDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/navbar.html'
    }
};