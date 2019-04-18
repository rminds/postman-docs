module.exports = [function() {
    return new(function() {
        this.build = function(values, submit, auto_lock = false) {
            return {
                values: values || {},
                errors: {},
                locked: false,
                auto_lock: auto_lock,
                lock: function() {
                    this.locked = true;
                },
                unlock: function() {
                    this.locked = false;
                },
                submit: function($event) {
                    if ($event) {
                        $event.preventDefault();
                    }

                    if (!this.locked) {
                        if (this.auto_lock) {
                            this.locked = true;
                        }
                        
                        return submit(this);
                    }
                },
                resetValues: function() {
                    return this.values = {};
                },
                resetErrors: function() {
                    return this.errors = {};
                },
                reset: function() {
                    return this.resetValues() & this.resetErrors();
                }
            };
        };
    });
}];