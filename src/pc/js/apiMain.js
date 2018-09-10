define(['jquery'], function ($) {
    var AJAX_CONFIG = {
        root: '/CheckBill',
        login: {
            url: '/login',
            params: {
                username: '',
                password: ''
            }
        },
        selectUser: {
            url: '/selectUser'
        },
        getUrl: function (prop) {
            return this.root + this[prop].url;
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