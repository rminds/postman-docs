let EndpointItemDirective = function($scope, $interpolate, ApiRequest) {
    $scope.examples = {
        show: false
    };

    if ($scope.endpoint.request) {
        $scope.method_lc = ($scope.endpoint.request.method || '').toLowerCase();
    }

    $scope.editor = {
        data: false,
        send: function() {
            let parseKeyValue = function(header) {
                let out = {};

                if (!header || header.length == 0) {
                    return out;
                }

                header.forEach(element => {
                    out[element.key] = element.value;
                });

                return out;
            };

            let method = this.data.request.method;
            let url = $interpolate(
                this.data.request.url.raw
            )(Object.assign(
                JSON.parse(JSON.stringify($scope.$root.variables)),
                parseKeyValue(this.data.request.url.query)
            ));
            
            let body = {};
            
            if (this.data.request.body && typeof(this.data.request.body.raw) == 'string') {
                body = JSON.parse(this.data.request.body.raw);
            }
            
            ApiRequest.ajax(
                method,
                url,
                body || {},
                parseKeyValue(this.data.request.header)
            ).then(res => {
                $scope.editor.response = res;
            }, res => {
                $scope.editor.response = res;
            });
        },
        edit: function() {
            this.data = JSON.parse(JSON.stringify($scope.endpoint));
        },
        clear: function() {
            this.data = false;
        }
    };

    $scope.makeCall = function(endpoint) {
        ajax
    }
};

module.exports = () => {
    return {
        scope: {
            'endpoint': '='
        },
        controller: [
            '$scope',
            '$interpolate',
            'ApiRequest',
            EndpointItemDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/endpoint-item.html'
    }
};