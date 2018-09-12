define(['jquery', 'bootstrap', 'MessageBox'], function ($, bootstrap, MessageBox) {
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

        this.wrapper = arguments['wrapper'] ? arguments['wrapper'] :
            '<div class="common__ajaxBox__wrapper"></div>';
        this.LOADING_HTML = arguments['LOADING_HTML'] ? arguments['LOADING_HTML']
            : '<div class="common__ajaxBox loading">加载中...</div>';
        this.NO_DATA_HTML = arguments['NO_DATA_HTML'] ? arguments['NO_DATA_HTML']
            : '<div class="common__ajaxBox noData">暂无数据 ！</div>';

        this.init();
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
                var ajaxBox = options.ajaxBox;
                _this.hideLoading(ajaxBox);

                console.log('AJAX_SUCCESS');
            })
            .ajaxError(function (event, xhr, options) {
                var ajaxBox = options.ajaxBox;
                _this.hideLoading(ajaxBox);
                MessageBox.show('错误', '娘席逼~请求失败了！', MessageBox.Buttons.OK, MessageBox.Icons.ERROR);

                console.log('AJAX_ERROR');
            })
            .ajaxComplete(function (event, xhr, options) {
                var ajaxBox = options.ajaxBox;
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
        this.removeWrapper();
        return this;
    };
    /**
     *
     * @param ajaxBox
     * @returns {Common}
     */
    Common.prototype.showNoData = function (ajaxBox) {
        this.removeWrapper();
        ajaxBox.append($(this.wrapper).html(this.NO_DATA_HTML));
        return this;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.removeWrapper = function () {
        var _this = this;
        if ($(this.WRAPPER_SELECTOR)[0]) {
            $(_this.WRAPPER_SELECTOR).addClass('hide');
            setTimeout(function () {
                $(_this.WRAPPER_SELECTOR).remove();
            }, 300);
        }
        return this;
    };
    /**
     *
     * @returns {Common}
     */
    Common.prototype.handleSVG = function () {
        var obj = $("path")[0];
        var length = obj.getTotalLength();
        console.log(length);
        return this;
    };
    /**
     * 实例化匿名对象
     */
    return new Common({
        LOADING_HTML: LOAD_NODE
    });
});
