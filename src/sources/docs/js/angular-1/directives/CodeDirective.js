let CodeDirective = function($scope, $element) {
    let block = $element.find('code');
    let draw = function(json) {
        block.text(json);

        $element.find('code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    };

    $scope.$watch('data', function(n) {
        if (!n) {
            return;
        }

        try {
            if (typeof(n) == 'object') {
                draw(JSON.stringify($scope.data, null, '    '));
            } else if (typeof(n) == 'string') {
                draw(JSON.stringify(JSON.parse(n), null, '    '));
            } 
        } catch (error) {}
    });
};

module.exports = () => {
    return {
        scope: {
            data: "="
        },
        controller: [
            '$scope',
            '$element',
            CodeDirective
        ],
        templateUrl: './assets/tpl/code.html'
    }
};