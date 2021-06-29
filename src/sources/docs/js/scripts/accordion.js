$.fn.accordion = function() {
    let accordion = ($el) => {
        this.active = function () {
            $el.on('click', '.accordion-head', function(){
                let $parent = $(this).parent('.accordion-item');

                $parent.hasClass('active') ? $parent.removeClass('active') : $parent.addClass('active').siblings().removeClass('active');
            })
        }

        this.init = function () {
            this.active();
        }

        this.init();
    }

    for (let i = 0; i < this.length; i++) {
        accordion($(this[i]));
    }
}

$('[accordion]').accordion();