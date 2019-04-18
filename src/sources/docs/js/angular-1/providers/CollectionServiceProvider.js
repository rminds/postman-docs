let flatten = function(collection, key) {
    let out = [];

    collection.forEach(element => {
        if (element[key] && element[key].length > 0) {
            out.push(element);
            out = out.concat(flatten(element[key], key));
        } else {
            out.push(element);
        }
    });

    return out;
};

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    length = length || 5;

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

let CollectionObject = function(collection) {
    this.collection = JSON.parse(JSON.stringify(collection));

    this.variables = function() {
        let variables = {};

        if (Array.isArray(this.collection.variable)) {
            this.collection.variable.forEach(variable => {
                variables = variable.value;
            });
        }

        return variables;
    };

    this.items = () => {
        return this.collection.item || [];
    }

    this.endpointsMap = function() {
        return flatten(this.collection.item, 'item').map(function(item) {
            item.uid = makeid(20);

            /* if (item.request) {
                item.request.url.raw = $interpolate(
                    item.request.url.raw
                )($scope.$root.variables);
            }

            if (item.response) {
                item.response.forEach(response => {
                    response.originalRequest.url.raw = $interpolate(
                        response.originalRequest.url.raw
                    )($scope.$root.variables);
                })
            } */

            return item;
        });
    }
};

let CollectionServiceProvider = function() {
    let defaultCollection = null;

    this.setDefault = (collection) => {
        defaultCollection = JSON.parse(JSON.stringify(collection));
    };

    this.$get = ['$q', ($q) => {
        let CollectionService = function() {
            let self = this;
            this.storageKey = 'collection';

            this.defaultCollection = function() {
                return defaultCollection ? new CollectionObject(
                    defaultCollection
                ) : null;
            };

            this.has = function() {
                return localStorage.hasOwnProperty(this.storageKey);
            }

            this.get = function($default = null) {
                if (this.has()) {
                    return new CollectionObject(
                        JSON.parse(localStorage.getItem(this.storageKey))
                    );
                }

                return $default;
            };

            this.set = function(value) {
                localStorage.setItem(this.storageKey, JSON.stringify(value));
            };

            this.importCollection = function() {
                let input = false;

                return $q(function(resolve, reject) {

                    try {
                        input = document.createElement('input');
                        input.setAttribute("type", "file");
                        input.setAttribute("accept", "application/json");
                        input.style.display = 'none';

                        input.addEventListener('change', function(e) {
                            let fileReader = new FileReader();

                            fileReader.onload = (evt) => {
                                self.set(JSON.parse(evt.target.result));
                                resolve();
                            };

                            fileReader.readAsText(e.target.files[0]);
                            input.remove();
                        });

                        document.querySelector('body').appendChild(input);

                        input.click();
                    } catch (e) {
                        reject();
                    };
                });
            };
        }
        return new CollectionService()
    }];
};

module.exports = [
    () => new CollectionServiceProvider()
];