let ModalApiTokenEditCompontent = function(
    CredentialsService,
    FormBuilderService
) {
    let $ctrl = this;

    $ctrl.$onInit = () => {
        $ctrl.form = FormBuilderService.build({
            access_token: CredentialsService.get() || '',
        }, (form) => {
            CredentialsService.set(form.values.access_token);
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
        'CredentialsService',
        'FormBuilderService',
        ModalApiTokenEditCompontent
    ],
    templateUrl: () => {
        return '/assets/tpl/modals/modal-api-token-edit-component.html';
    }
};