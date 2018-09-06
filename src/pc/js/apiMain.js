define(['jquery'], function ($) {
    var apiConfig = {
        login: '/CheckBill/login',
        queryParams: {
            loginname: 'admin',
            password: '123456'
        }
    };

    return apiConfig;
});