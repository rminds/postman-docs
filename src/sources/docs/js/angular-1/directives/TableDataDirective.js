let TableDataDirective = function($scope) {};

module.exports = () => {
    return {
        scope: {
            'rows': '='
        },
        controller: [
            '$scope',
            TableDataDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/table-data.html'
    }
};