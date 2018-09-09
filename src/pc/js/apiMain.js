define(['jquery'], function ($) {
    var AJAX_CONFIG = {
        login: {
            url: '/CheckBill/login',
            params: 'username=' + $('#username').val()
            + '&password=' + $('#password').val()
        },
        getParams: function (api) {
            var data = '';
            for (var key in this[api].params) {
                data += key + '=' + this.params[key] + '&';
            }
            return data.substring(0, data.length - 1);
        }
    };

    return AJAX_CONFIG;
});