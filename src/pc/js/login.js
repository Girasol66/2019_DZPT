require(['jquery', 'common', 'template', 'apiMain', 'MessageBox'], function ($, common, template, apiMain, MessageBox) {
    /**
     *
     * @constructor
     */
    function LoginPage() {
        var args = arguments.length ? arguments.length[0] : arguments;
        this.username = args['username'] ? args['username'] : '#username';
        this.password = args['password'] ? args['password'] : '#password';
        this.container = args['container'] ? args['container'] : '.login';
        this.btnLogin = args['btnLogin'] ? args['btnLogin'] : '.btn-login';

        this.init();
    }
    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.init = function () {
        this.submit();
        this.keyDownSubmit();
        return this;
    };
    /**
     *
     * @returns {boolean}
     */
    LoginPage.prototype.notNullCheck = function () {
        var result = false;
        if (!$(this.username).val().trim()) {
            MessageBox.show('提示', '用户名不能为空 !', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
        } else if (!$(this.password).val().trim()) {
            MessageBox.show('提示', '密码不能为空 !', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
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
        var _this = this;
        var data = $(this.username + ',' + this.password).serialize();
        $.ajax({
            url: apiMain.getUrl('login'),
            data: data,
            type: 'POST',
            processData: false,
            $renderContainer: $(_this.container),
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    window.location.href = 'index.html';
                } else {
                    MessageBox.show('错误', '用户名或密码错误 !', MessageBox.Buttons.OK, MessageBox.Icons.ERROR);
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.submit = function () {
        var _this = this;
        $(document).on('click', this.btnLogin, function () {
            if (_this.notNullCheck()) {
                _this.ajaxRequestCheck();
            }
        });
        return this;
    };
    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.keyDownSubmit = function () {
        var _this = this;
        $(document).keydown(function (e) {
            if (e.keyCode === 13) {
                if (_this.notNullCheck()) {
                    _this.ajaxRequestCheck();
                }
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
