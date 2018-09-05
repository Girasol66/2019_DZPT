require(['jquery', 'common', 'template', 'apiMain'], function ($, common, template, apiMain) {
    /**
     *
     * @constructor
     */
    function LoginPage() {
        var args = arguments.length ? arguments.length[0] : arguments;
        this.username = args['username'] ? args['username'] : '#username';
        this.password = args['password'] ? args['password'] : '#password';

        this.init();
    }

    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.init = function () {
        if (this.notNullCheck()) {
            this.ajaxRequestCheck();
        }
        return this;
    };

    /**
     *
     * @returns {boolean}
     */
    LoginPage.prototype.notNullCheck = function () {
        var result = false;
        if (!$(this.username).val().trim()) {

        } else if (!$(this.password).val().trim()) {

        } else {
            result = true;
        }
        return result;
    };

    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.ajaxRequestCheck = function () {
        $.ajax({
            url: apiMain.login,
            data: apiMain.queryParams,
            type: 'POST',
            dataType: 'JSON',
            success: function () {
                window.location.href = 'main.html';
            },
            error: function (msg) {
                console.log(msg);
            }
        });
        return this;
    };

    /**
     *
     * @type {LoginPage}
     */
    var login = new LoginPage();

});
