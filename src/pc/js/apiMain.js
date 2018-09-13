define(['jquery'], function ($) {
    var apis = {
        root: '/CheckBill',
        login: {
            url: '/login',
            params: {
                username: '',
                password: ''
            }
        },
        selectUser: {
            url: '/user/selectUser',
            params: {
                pageIndex: 1,
                pageSize: 10,
                realName: ''
            }
        },
        selectCheckBillLog: {
            url: '/checkBillLog/selectCheckBillLog',
            params: {
                pageIndex: 1,
                pageSize: 10,
                beginDate: '',
                endDate: ''
            }
        },
        deleteUser: {
            url: '/user/removeUser',
            params: {
                ids: 1000
            }
        },
        insertUser: {
            url: '/user/addUser',
            params: {
                real_name: '',
                mobile_no: '',
                login_name: '',
                login_pwd: ''
            }
        },
        selectBankRecord: {
            url: '/bankRecord/selectBankRecord',
            params: {
                pageIndex: 1,
                pageSize: 10,
                beginDate: "20010909",
                endDate: "20180909",
                payName: "支付宝"
            }
        },
        selectCheckBase: {
            url: '/checkBase/selectCheckBase',
            params: {
                pageIndex: 1,
                pageSize: 10,
                payName: '',
                beginDate: '',
                endDate: ''
            }
        },
        selectFileStatus: {
            url: '/fileStatus/selectFileStatus',
            params: {
                beginDate: '',
                endDate: '',
                pageIndex: 1,
                pageSize: 10
            }
        },
        selectMerchant: {
            url: '/merchant/selectMerchant',
            params: {
                pageIndex: 1,
                pageSize: 10,
                merchantName: "上海人民医院"
            }
        },
        deleteMerchant: {
            url: '/merchant/removeMerchant',
            params: {
                ids: '2'
            }
        },
        updateMerchant: {
            url: '/merchant/updateMerchant',
            params: {
                id: 4,
                group_corp_no: "123"
            }
        },
        insertMerchant: {
            url: '/merchant/addMerchant',
            params: {
                merchant_no: '1552451',
                merchant_name: '上海市人民中心医院'
            }
        },
        selectMerchantRecord: {
            url: '/merchantRecord/selectMerchantRecord',
            params: {
                pageIndex: 1,
                pageSize: 10,
                beginDate: '20010909',
                endDate: '20180909',
                payName: '支付宝'
            }
        },
        selectMisTake: {
            url: '/misTake/selectMisTake',
            params: {
                pageIndex: 1,
                pageSize: 10,
                beginDate: '',
                endDate: '',
                payName: ''
            }
        },
        selectScratchPool: {
            url: '/scratchPool/selectScratchPool',
            params: {
                pageIndex: 1,
                pageSize: 10,
                beginDate: "20010909",
                endDate: "20180909",
                payName: "支付宝"
            }
        },
        getUrl: function (api) {
            return this.root + this[api].url;
        },
        getParams: function () {
            var data = '';
            var args = arguments.length ? arguments[0] : arguments;
            for (var key in args) {
                data += key + '=' + args[key] + '&';
            }
            return data.substring(0, data.length - 1);
        }
    };

    return apis;
});