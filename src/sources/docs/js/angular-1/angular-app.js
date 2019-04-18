let app = angular.module('docsApp', [
    'ngSanitize',
    'btford.markdown'
]);

app.constant('appConfigs', ENV);

// providers
app.provider('ApiRequest', require('./providers/ApiRequestProvider'));
app.provider('ModalRoute', require('./providers/ModalRouteProvider'));
app.provider('CollectionService', require('./providers/CollectionServiceProvider'));

// services
app.service('CredentialsService', require('./services/CredentialsService'));
app.service('FormBuilderService', require('./services/FormBuilderService'));
app.service('ModalService', require('./services/ModalService'));

// controllers
app.controller('BaseController', require('./controllers/BaseController'));

// components
app.component('modalApiUrlEditCompontent', require('./components/Modals/ModalApiUrlEditCompontent'));
app.component('modalApiTokenEditCompontent', require('./components/Modals/ModalApiTokenEditCompontent'));

// directives
app.directive('navBar', require('./directives/NavBarDirective'));
app.directive('navBarItem', require('./directives/NavBarItemDirective'));
app.directive('navBarFooter', require('./directives/NavBarFooterDirective'));

app.directive('endpointItem', require('./directives/EndpointItemDirective'));
app.directive('exampleResponses', require('./directives/ExampleResponsesDirective'));
app.directive('exampleResponseItem', require('./directives/ExampleResponsetItemDirective'));

app.directive('tableData', require('./directives/TableDataDirective'));
app.directive('requestEditor', require('./directives/RequestEditorDirective'));
app.directive('keyValueEditor', require('./directives/KeyValueEditorDirective'));

app.directive('codeDir', require('./directives/CodeDirective'));
app.directive('scrollTo', require('./directives/ScrollToDirective'));

app.directive('modalItem', require('./directives/modals/ModalItemDirective'));
app.directive('modalsRoot', require('./directives/modals/ModalsRootDirective'));
app.directive('modalScrollBraker', require('./directives/modals/ModalScrollBrakerDirective'));

// Filters
app.filter('pretty_json', require('./filters/PrettyJsonFilter'));

// Configs
app.config(require('./routes/modals'));
app.config(require('./configs/collection'));

app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
}])

$(function() {
    setTimeout(() => {
        angular.bootstrap(document.querySelector('body'), ['docsApp']);
    }, 1000);
});