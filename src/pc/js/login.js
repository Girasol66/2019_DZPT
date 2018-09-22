require(['jquery', 'common', 'template', 'apiMain', 'MessageBox', 'Toast'], function ($, common, template, apiMain, MessageBox, Toast) {
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
    };
    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.init = function () {
        this.submit();
        this.dataSave();
        this.keyDownSubmit();
        return this;
    };
    /**
     *
     * @returns {boolean}
     */
    LoginPage.prototype.notNullCheck = function () {
        var result = false;
        var toast = new Toast.Toast();
        if (!$(this.username).val().trim()) {
            toast.show(Toast.INFORMATION, '用户名不能为空！');
            $(this.username).focus();
        } else if (!$(this.password).val().trim()) {
            toast.show(Toast.INFORMATION, '密码不能为空！');
            $(this.password).focus();
        } else {
            result = true;
        }
        toast = null;
        return result;
    };
    /**
     *
     * @returns {LoginPage}
     */
    LoginPage.prototype.ajaxRequestCheck = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('login'),
            data: apiMain.getParams({
                username: $(this.username).val(),
                password: $(this.password).val()
            }),
            $renderContainer: $(_this.container),
            success: function (data) {
                var toast = new Toast.Toast();
                if (data.code !== this.ERR_NO) {
                    _this.dataSave(data.data);
                    window.location.href = 'index.html';
                } else {
                    toast.show(Toast.ERROR, '用户名或密码错误！');
                }
                toast = null;
            }
        });
        toast = null;
        return this;
    };
    /**
     *
     * @param params
     * @returns {LoginPage}
     */
    LoginPage.prototype.dataSave = function (params) {
        var store = {
            requestKey: '',
            username: params
        };

        sessionStorage.setItem('store', JSON.stringify(store));
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
