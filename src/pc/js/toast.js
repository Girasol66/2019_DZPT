define(['jquery'], function ($) {
    function Toast() {
        var args = arguments.length ? arguments[0] : arguments;
        this.domId = args['domId'] ? args['domId'] : '';
        this.timer = args['timer'] ? args['timer'] : null;
        this.template = args['template'] ? args['template'] : '';

        this.constructor();
    }

    /**
     *
     * @returns {Toast}
     */
    Toast.prototype.constructor = function () {
        return this;
    };
    /**
     *
     * @returns {string}
     */
    Toast.prototype.getTemplate = function (type, message) {
        var clazz = ' ' + type.substring(5, type.length);
        this.domId = 'toast_' + new Date().getTime();
        this.template = '<div id="' + this.domId + '" class="toast' + clazz + ' hide">'
            + '<div class="toast-box"><i class="toast-icon ' + type + '"></i>'
            + '<p class="toast-info">' + message + '</p></div></div>';
        return this.template;
    };
    /**
     *
     * @param type
     * @param message
     * @returns {Toast}
     */
    Toast.prototype.show = function (type, message) {
        var _this = this;
        var template = this.getTemplate(type, message);
        $('body').append(template);
        this.timer = setTimeout(function () {
            $('#' + _this.domId).removeClass('hide');
            _this.timer = setTimeout(function () {
                _this.hide();
            }, 3000);
        }, 30);
        return this;
    };
    /**
     *
     * @returns {Toast}
     */
    Toast.prototype.hide = function () {
        $('#' + this.domId).addClass('hide');
        if (this.timer) clearInterval(this.timer);
        this.timer = setTimeout(function () {
            $('#' + this.domId).remove();
        }.bind(this), 300);
        this.timer = null;
        return this;
    };

    return {
        Toast: Toast,
        ERROR: 'icon-error',
        WARNING: 'icon-warning',
        SUCCESS: 'icon-success',
        QUESTION: 'icon-question',
        INFORMATION: 'icon-information'
    }
});