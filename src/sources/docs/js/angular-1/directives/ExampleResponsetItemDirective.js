let ExampleRequestItemDirective = function($scope) {};

module.exports = () => {
    return {
        scope: {
            'response': '='
        },
        controller: [
            '$scope',
            ExampleRequestItemDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/example-response-item.html'
    }
};