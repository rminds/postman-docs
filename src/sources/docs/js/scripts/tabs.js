$.prototype.tabs = function () {
    let tabs = ($el) => {
        let $tabLink = $el.find('.tab-link');

        this.active = function () {
            $tabLink.on('click', function(e) {
                let data = $(this).data('tab');

                e.preventDefault();
                $(this).addClass('active').siblings('.tab-link').removeClass('active');
                $el.closest('body').find('#' + data).addClass('active').siblings('.tab-content').removeClass('active');
            });
        }

        this.init = function () {
            this.active();
        }

        this.init();
    };

    for (let i = 0; i < this.length; i++) {
        tabs($(this[i]));
    }
};

$('[tabs]').tabs();