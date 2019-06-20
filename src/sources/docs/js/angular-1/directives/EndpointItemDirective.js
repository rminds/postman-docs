let EndpointItemDirective = function($scope, $interpolate, ApiRequest) {
    $scope.examples = {
        show: false
    };

    if ($scope.endpoint.request) {
        $scope.method_lc = ($scope.endpoint.request.method || '').toLowerCase();
    }

    let rtrim = (str, char) => {
        while (str.length > 0 && str[str.length - 1] == char) {
            str = str.slice(0, str.length - 1);
        }

        return str;
    };

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
            let queryCollection = this.data.request.url.query;

            let url = $interpolate(
                this.data.request.url.raw
            )(Object.assign(
                JSON.parse(JSON.stringify($scope.$root.variables)), {

                }
            ));

            let queryString = queryCollection.map(val => {
                return `${val.key}=${val.value}`;
            }).join('&');

            url = rtrim(url, '?') + (
                queryString.length > 0 ? '?' + queryString : queryString
            );

            let body = {};

            if ((method != 'GET') && this.data.request.body &&
                typeof(this.data.request.body.raw) == 'string') {
                body = JSON.parse(this.data.request.body.raw);
            }

            ApiRequest.ajax(method, url, body, parseKeyValue(
                this.data.request.header
            )).then(res => {
                $scope.editor.response = res;
            }, res => {
                $scope.editor.response = res;
            });
        },
        edit: function() {
            this.data = JSON.parse(JSON.stringify($scope.endpoint));

            if (!this.data.request.header) {
                this.data.request.header = [];
            }

            if (!this.data.request.url.query) {
                this.data.request.url.query = [];
            }

            this.data.request.url.raw = rtrim(this.data.request.url.raw, '?');
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