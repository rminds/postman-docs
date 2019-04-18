let ScrollToDirective = function(scope, element, attributes) {
    $(element).bind('click', function() {
        if ($(attributes.scrollTo).length == 0) {
            return;
        }

        $('html, body').animate({
            scrollTop: $(attributes.scrollTo).offset().top
        }, 0);
    });
};

module.exports = () => {
    return {
        restrict: "EA",
        link: ScrollToDirective
    };
};