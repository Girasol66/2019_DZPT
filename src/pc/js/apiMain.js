define(['jquery'], function ($) {
    var AJAX_CONFIG = {
        login: '/CheckBill/login',
        params: {
            username: 'admin',
            password: '123456'
        },
        getParams: function () {
            var data = '';
            for (var key in this.params) {
                data += key + '=' + this.params[key] + '&';
            }
            return data.substring(0, data.length - 1);
        }
    };

    return AJAX_CONFIG;
});