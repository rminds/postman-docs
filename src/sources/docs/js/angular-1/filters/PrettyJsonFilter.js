module.exports = function() {
    return function(_in) {
        return JSON.stringify(_in, null, '    ');
    }
};