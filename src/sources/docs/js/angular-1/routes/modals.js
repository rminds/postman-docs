module.exports = ['ModalRouteProvider', function(ModalRouteProvider) {
    ModalRouteProvider.modal('modalApiUrlEdit', {
        component: 'modalApiUrlEditCompontent'
    });
    
    ModalRouteProvider.modal('modalApiTokenEdit', {
        component: 'modalApiTokenEditCompontent'
    });
}];