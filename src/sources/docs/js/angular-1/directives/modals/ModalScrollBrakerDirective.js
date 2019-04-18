module.exports = [() => {
    let ModalScrollBrakeDirective = function($scope, $element, ModalService) {
        $scope.modals = ModalService.getModals();

        $scope.$watch('modals', (modals) => {
            if (!modals) return;
            
            if (modals.length > 0) {
                $element.css('overflow', 'hidden');
            } else {
                $element.css('overflow', 'auto');
            }
        }, true);
    };

    return {
        scope: {},
        restrict: "EA",
        replace: true,
        controller: [
            '$scope',
            '$element',
            'ModalService',
            ModalScrollBrakeDirective
        ]
    };
}];