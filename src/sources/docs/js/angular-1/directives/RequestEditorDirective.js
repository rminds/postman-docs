let RequestEditorDirective = function(
    $timeout,
    $element,
    $scope
) {
    $scope.tabs = {
        activeKey: 0,
        list: $scope.request.method == 'GET' ? [
            'Headers', 'Query',
        ] : [
            'Headers', 'Query', 'Body',
        ]
    };

    $scope.selectTab = key => {
        $scope.tabs.activeKey = key;

        /* if ($scope.tabs.list[$scope.tabs.activeKey] == 'Body') {
            $timeout(function() {
                const editor = ace.edit($element.find('.ace-editor')[0]);

                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/json");
            }, 100);
        } */
    };
};

module.exports = () => {
    return {
        scope: {
            'request': '=',
            'query': '=',
            'body': '=',
            'headers': '=',
        },
        controller: [
            '$timeout',
            '$element',
            '$scope',
            RequestEditorDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/request-editor.html'
    }
};