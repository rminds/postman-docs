let NavBarFooterDirective = function() {};

module.exports = () => {
    return {
        controller: [
            NavBarFooterDirective
        ],
        replace: true,
        templateUrl: './assets/tpl/navbar-footer.html'
    }
};