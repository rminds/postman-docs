let modalApiUrlEditCompontent = function(
    $scope,
    FormBuilderService
) {
    let $ctrl = this;

    $ctrl.$onInit = () => {
        $ctrl.form = FormBuilderService.build({
            api_url: $scope.$root.variables.apiUrl || '',
        }, (form) => {
            $scope.$root.variables.apiUrl = form.values.api_url;
            $ctrl.modal.close();
        });
    };
    
    $ctrl.$onDestroy = function() {};
};

module.exports = {
    bindings: {
        close: '=',
        modal: '='
    },
    controller: [
        '$scope',
        'FormBuilderService',
        modalApiUrlEditCompontent
    ],
    templateUrl: () => {
        return 'assets/tpl/modals/modal-api-url-edit-component.html';
    }
};
