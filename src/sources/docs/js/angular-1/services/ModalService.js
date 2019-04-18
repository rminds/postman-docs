let ModalService = function(ModalRoute, $timeout) {
    let modals = {
        list: []
    };
    let modalKeys = Object.keys(ModalRoute.modals());

    this.modalKeyExists = (key) => {
        return modalKeys.indexOf(key) !== -1;
    };

    this.open = (key, scope, events) => {
        if (!this.modalKeyExists(key)) {
            throw new Error(`Unknown modal key "${key}".`);
        }

        $timeout(() => {
            modals.list.push({
                key: key,
                scope: scope,
                events: typeof(events) == 'object' ? events : {},
            });
        }, 0);
    };

    this.close = (modal) => {
        if (modals.list.indexOf(modal) !== -1) {
            modals.list.splice(modals.list.indexOf(modal), 1);
        }
    };

    this.getModals = () => {
        return modals.list;
    };
};

module.exports = ['ModalRoute', '$timeout', function(ModalRoute, $timeout) {
    return new ModalService(ModalRoute, $timeout);
}];