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
        insertUser: {
            url: '/user/addUser',
            params: {
                real_name: '',
                mobile_no: '',
                login_name: '',
                login_pwd: ''
            }
        },
        deleteUser: {
            url: '/user/removeUser',
            params: {
                ids: 1000
            }
        },
        updateUser: {
            url: '/user/updateUser',
            params: {
                id: '1001',
                real_name: '',
                mobile_no: '',
                login_name: '',
                login_pwd: ''
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
        insertMerchant: {
            url: '/merchant/addMerchant',
            params: {
                merchant_no: '1552451',
                merchant_name: '上海市人民中心医院'
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
                merchant_no: '',
                merchant_name: ''
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
        selectCheckBillLog: {
            url: '/checkBillLog/selectCheckBillLog',
            params: {
                pageIndex: 1,
                pageSize: 10,
                beginDate: '',
                endDate: ''
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
        selectCheckBaseCount: {
            url: '/checkBase/queryCheckBatchs',
            params: {
                beginDate: '20180101',
                endDate: '20180909'
            }
        },
        selectBankRecordCount: {
            url: '/bankRecord/selectQueryAll',
            params: {
                beginDate: '20180101',
                endDate: '20180909'
            }
        },
        selectMerchantRecordCount: {
            url: '/merchantRecord/selectQueryAll',
            params: {
                beginDate: '20180101',
                endDate: '20180909'
            }
        },
        insertPayWay: {
            url: '/payWay/addPayWay',
            params: {
                pay_way_code: "11",
                pay_way_name: "扫码",
                pay_type_code: "232",
                pay_type_name: "支付宝"
            }
        },
        deletePayWay: {
            url: '/payWay/removePayWay',
            params: {
                ids: '1'
            }
        },
        updatePayWay: {
            url: '/payWay/updatePayWay',
            params: {
                pay_way_code: "11",
                pay_way_name: "扫码",
                pay_type_code: "232",
                pay_type_name: "支付宝"
            }
        },
        selectPayWay: {
            url: '/payWay/selectPayWay',
            params: {
                pageIndex: 1,
                pageSize: 10,
                payName: ''
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