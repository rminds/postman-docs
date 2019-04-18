module.exports = function() {
    return new(function() {
        var modals = {};

        this.modal = function(modal, config) {
            modals[modal] = config;
        };

        this.$get = [() => {
            return {
                modals: () => modals
            }
        }];
    });
};