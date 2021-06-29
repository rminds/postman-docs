$.fn.accordion = function() {
    let accordion = ($el) => {
        let with_inner = $el.hasClass('with_inner');

        this.active = function () {
            $el.on('click', '.accordion-head', function(){
                if ($(this).hasClass('inner')) {
                    let $parent = $(this).parent('.accordion-item.inner');

                    $parent.hasClass('active') ? $parent.removeClass('active') : $parent.addClass('active').siblings().removeClass('active');
                } else {
                    let $parent = $(this).parent('.accordion-item');

                    $parent.hasClass('active') ? $parent.removeClass('active') : $parent.addClass('active').siblings().removeClass('active');
                }
                
            });
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