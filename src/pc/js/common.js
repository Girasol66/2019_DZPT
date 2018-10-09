define(['jquery', 'bootstrap', 'MessageBox', 'Toast', 'bootstrapDateTimePicker', 'bootstrapDateTimePickerLocal_zh_CN'], function ($, bootstrap, MessageBox, Toast) {
    var LOAD_NODE = '<div class="spinner">'
        + '<div class="spinner-container container1">'
        + '<div class="circle1"></div>'
        + '<div class="circle2"></div>'
        + '<div class="circle3"></div>'
        + '<div class="circle4"></div></div>'
        + '<div class="spinner-container container2">'
        + '<div class="circle1"></div>'
        + '<div class="circle2"></div>'
        + '<div class="circle3"></div>'
        + '<div class="circle4"></div></div>'
        + '<div class="spinner-container container3">'
        + '<div class="circle1"></div>'
        + '<div class="circle2"></div>'
        + '<div class="circle3"></div>'
        + '<div class="circle4"></div></div></div>';

    /**
     *
     * @constructor
     */
    function Common() {
        var arguments = arguments.length !== 0 ? arguments[0] : arguments;

        this.timer = arguments['timer'] ? arguments['timer'] : null;
        this.WRAPPER_SELECTOR = arguments['WRAPPER_SELECTOR'] ?
            arguments['WRAPPER_SELECTOR'] : '.common__ajaxBox__wrapper';

        this.DATE_SEL = arguments['DATE_SEL'] ? arguments['DATE_SEL'] : '.form-date';

        this.wrapper = arguments['wrapper'] ? arguments['wrapper'] :
            '<div class="common__ajaxBox__wrapper"></div>';
        this.LOADING_HTML = arguments['LOADING_HTML'] ? arguments['LOADING_HTML']
            : '<div class="common__ajaxBox loading">' + LOAD_NODE + '</div>';
        this.NO_DATA_HTML = arguments['NO_DATA_HTML'] ? arguments['NO_DATA_HTML']
            : '<div class="common__ajaxBox noData"><img src="../images/noData.png"/></div>';

        this.init();

        console.log('对于我的颜值 只想用一句话来形容 我都想操了我自己！');
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.init = function () {
        this.checkUser();
        this.ajaxInitDefault();
        this.ajaxExtend();
        return this;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.ajaxExtend = function () {
        var _this = this;
        $(document)
            .ajaxSend(function (event, xhr, options) {

                var ajaxBox = options.$renderContainer;
                options.ajaxBox = ajaxBox;
                _this.showLoading(ajaxBox);

                console.log('AJAX_SEND');
            })
            .ajaxSuccess(function (event, xhr, options, data) {
                if (!_this.ajaxDataIsExist(data)) {
                    var ajaxBox = options.ajaxBox;
                    _this.showNoData(ajaxBox);
                }
                console.log('AJAX_SUCCESS');
            })
            .ajaxError(function (event, xhr, options) {
                var ajaxBox = options.ajaxBox;
                _this.hideLoading(ajaxBox);
                var toast = new Toast.Toast();
                toast.show(Toast.ERROR, '服务器连接异常！');
                toast = null;
                console.log('AJAX_ERROR');
            })
            .ajaxComplete(function (event, xhr, options) {
                var ajaxBox = options.ajaxBox;
                _this.dateTimePickerInit();
                _this.hideLoading(ajaxBox);
                console.log("AJAX_COMPLETE");
            });
        return this;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.ajaxInitDefault = function () {
        $.ajaxSetup({
            ERR_NO: 0,
            SUCCESS_NO: 200,
            timeout: 20000,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: 'application/x-www-form-urlencoded'
        });
        return this;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.checkUser = function () {
        var time = 20 * 60 * 1000;
        if (this.timer) clearInterval(this.timer);
        this.timer = setTimeout(function () {
            sessionStorage.removeItem('store');
            window.location.href = 'login.html';
        }, time);
        var store = sessionStorage.getItem('store');
        var href = window.location.href;
        if (-1 === href.indexOf('login') && !store) {
            window.location.href = 'login.html';
        }
        return this;
    };
    /**
     *
     * @param ajaxBox
     * @returns {Common}
     */
    Common.prototype.showLoading = function (ajaxBox) {
        this.removeWrapper();
        ajaxBox.append($(this.wrapper).html(this.LOADING_HTML));
        return this;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.hideLoading = function () {
        if ($('.loading')[0]) {
            $(this.WRAPPER_SELECTOR).remove();
        }
        return this;
    };
    /**
     *
     * @param ajaxBox
     * @returns {Common}
     */
    Common.prototype.showNoData = function (ajaxBox) {
        this.removeWrapper();
        ajaxBox.html($(this.wrapper).html(this.NO_DATA_HTML));
        return this;
    };
    /**
     *
     * @param data
     * @returns {boolean|Number}
     */
    Common.prototype.ajaxDataIsExist = function (data) {
        var data = data.data;
        return ((typeof data === 'string'
        || data instanceof Array && data.length
        || !(data instanceof Array) && data));
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.removeWrapper = function () {
        var _this = this;
        if ($(this.WRAPPER_SELECTOR)[0]) {
            $(_this.WRAPPER_SELECTOR).remove();
        }
        return this;
    };
    /**
     *
     * @param offsetTime
     * @returns {string}
     */
    Common.prototype.parseDate = function (offsetTime) {
        var date = new Date(offsetTime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        year = year > 9 ? year : '0' + year;
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;

        return year + '-' + month + '-' + day;
    };
    /**
     *
     * @param dateStr
     * @param format
     * @returns {string}
     */
    Common.prototype.dateFormat = function (dateStr, format) {
        if ('yyyyMMdd' === format && dateStr) {
            var arr = dateStr.split('-');
            dateStr = arr.join('');
        } else if ('yyyy-mm-dd' === format && dateStr) {
            var year = dateStr.substring(0, 4);
            var month = dateStr.substring(4, 6)
            var day = dateStr.substring(6, 8);
            dateStr = year + '-' + month + '-' + day;
        }
        return dateStr || '';
    };
    /**
     *
     * @param params
     * @returns {string}
     */
    Common.prototype.getIconType = function (params) {
        var iconType = '';
        var icons = [
            {
                text: '全部',
                icon: 'icon-all'
            },
            {
                text: '支付宝',
                icon: 'icon-aliPay'
            },
            {
                text: '微信',
                icon: 'icon-weChat'
            },
            {
                text: '现金',
                icon: 'icon-cash'
            },
            {
                text: '银联扫码',
                icon: 'icon-unionPay'
            }
        ];
        for (var icon in icons) {
            if (icons[icon].text === params) {
                iconType = icons[icon].icon
            }
        }
        return iconType;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.dateTimePickerInit = function () {
        $(this.DATE_SEL).datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            minView: 'month',
            autoclose: true
        });
        return this;
    };
    /**
     * 实例化匿名对象
     */
    return new Common();
});
