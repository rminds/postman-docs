let RequestEditorDirective = function($scope) {
    $scope.tabs = {
        activeKey: 0,
        list: [
            'Headers',
            'Query',
            'Body',
        ]
    };
};

module.exports = () => {
    return {
        scope: {
            'query': '=',
            'body': '=',
            'headers': '=',
        },
        controller: [
            '$scope',
            RequestEditorDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/request-editor.html'
    }
};