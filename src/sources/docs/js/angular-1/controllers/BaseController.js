let BaseController = function(
    $scope,
    $rootScope,
    $interpolate,
    ModalService,
    CollectionService,
) {
    $scope.collection = null;
    $scope.defaultCollection = true;

    $scope.initCollection = () => {
        if (CollectionService.has()) {
            $scope.defaultCollection = false;
            $scope.collection = CollectionService.get();
        } else {
            $scope.defaultCollection = true;
            $scope.collection = CollectionService.defaultCollection();
        }

        if ($scope.collection != null) {
            $rootScope.variables = $scope.collection.variables();
            $scope.endpoints = $scope.collection.endpointsMap();

            let scope_ = {
                pm: {
                    environment: {
                        set: (key, value) => {
                            // console.log(key, value);
                        }
                    }
                }
            }

            $interpolate('{{ pm.environment.set("record_type", "test") }}')(scope_);
        }

        $scope.data = $scope.collection;
    };

    $scope.setApiUrl = () => {
        ModalService.open('modalApiUrlEdit');
    };

    $scope.setToken = () => {
        ModalService.open('modalApiTokenEdit');
    };

    $scope.importCollection = () => {
        CollectionService.importCollection().then(function() {
            $scope.initCollection();
        });
    };

    $scope.resetCollection = () => {
        CollectionService.importCollection().then(function() {
            $scope.initCollection();
        });
    };

    $scope.initCollection();
}

module.exports = [
    '$scope',
    '$rootScope',
    '$interpolate',
    'ModalService',
    'CollectionService',
    BaseController
];