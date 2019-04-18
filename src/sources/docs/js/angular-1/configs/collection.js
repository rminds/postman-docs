module.exports = ['CollectionServiceProvider', 'appConfigs', function(CollectionServiceProvider, appConfigs) {
    CollectionServiceProvider.setDefault(appConfigs.collection || null);
}];