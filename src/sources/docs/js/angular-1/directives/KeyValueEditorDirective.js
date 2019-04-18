let KeyValueEditorDirective = function($scope) {
    $scope.addField = function() {
        $scope.collection.push({
            key: "",
            value: "",
        })
    };

    $scope.deleteField = (index) => {
        $scope.collection.splice(index, 1);
    };
};

module.exports = () => {
    return {
        scope: {
            'collection': '=',
        },
        controller: [
            '$scope',
            KeyValueEditorDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/key-value-editor.html'
    }
};