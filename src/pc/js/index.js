require(['jquery', 'common', 'template', 'MessageBox', 'waves', 'apiMain'], function ($, common, template, MessageBox, waves, apiMain) {
    /**
     *
     * @constructor
     */
    function HomePage() {
        var args = arguments.length ? arguments.length[0] : arguments;
        this.pageCode = args['pageCode'] ? args['pageCode'] : 1;
        this.ACTIVE = args['ACTIVE'] ? args['ACTIVE'] : 'active';
        this.AJAX_XHR = args['AJAX_XHR'] ? args['AJAX_XHR'] : null;
        this.NAV_BAR = args['NAV_BAR'] ? args['NAV_BAR'] : '.nav-bar';
        this.NAV_ITEM = args['NAV_ITEM'] ? args['NAV_ITEM'] : '.nav-item';
        this.TEMPLATE = args['TEMPLATE'] ? args['TEMPLATE'] : '.template';
        this.CHECKBOX = args['CHECKBOX'] ? args['CHECKBOX'] : '.checkbox';
        this.BTN_RESET = args['BTN_RESET'] ? args['BTN_RESET'] : '.btn-reset';
        this.DROP_ITEM = args['DROP_ITEM'] ? args['DROP_ITEM'] : '.dropdown li';
        this.BTN_INSERT = args['BTN_INSERT'] ? args['BTN_INSERT'] : '.btn-insert';
        this.BTN_DELETE = args['BTN_DELETE'] ? args['BTN_DELETE'] : '.btn-delete';
        this.BTN_UPDATE = args['BTN_UPDATE'] ? args['BTN_UPDATE'] : '.btn-update';
        this.BTN_SELECT = args['BTN_SELECT'] ? args['BTN_SELECT'] : '.btn-select';

        this.init();
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.init = function () {
        this.dropMenuInit();
        this.wavesInit();
        this.selectCheckBox();
        this.showSubNavigation();
        this.dataRender();
        this.pagination();
        this.btnReset();
        this.dataInsert();
        this.dataDelete();
        this.dataUpdate();
        this.dataSelect();
        this.selectUsers('tpl-NAV01-SELECT');
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataRender = function () {
        var store = JSON.parse(sessionStorage.getItem('store'));
        $('.name').text('当前用户：【' + store.username + '】');
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dropMenuInit = function () {
        $('.dropdown-toggle').dropdown();
        $(document).on('click', this.DROP_ITEM, function () {
            var txt = $(this).text().trim() + ' ';
            var innerHtml = txt + '<span class="caret"></span>';
            $('.dropdown-toggle').html(innerHtml);
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.wavesInit = function () {
        //Set Waves
        waves.attach('h3.nav-title,h4.nav-title', ['waves-block']);
        waves.init();
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataInsert = function () {
        var _this = this;
        $(document).on('click', this.BTN_INSERT, function () {
            var btnText = $(this).text().trim();
            var updateId = $(this).attr('data-updateId').trim();
            var templateId = $(this).parents('.content').attr('data-template');
            switch (templateId) {
                case 'tpl-NAV02-INSERT':
                    if ('添加' === btnText) {
                        _this.insertUser();
                    } else if ('保存' === btnText) {
                        _this.updateUser();
                    }
                    break;
                case 'tpl-NAV04-INSERT':
                    if ('添加' === btnText) {
                        _this.insertMerchant();
                    } else if ('保存' === btnText) {
                        _this.updateMerchant();
                    }
                    break;
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.insertUser = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('insertUser'),
            data: apiMain.getParams({
                real_name: $('input[name="name"]').val(),
                mobile_no: $('input[name="phone"]').val(),
                login_name: $('input[name="username"]').val(),
                login_pwd: $('input[name="password"]').val()
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    MessageBox.show('提示', '添加成功！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
                    _this.selectUsers('tpl-NAV01-SELECT');
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.deleteUsers = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('deleteUser'),
            data: apiMain.getParams({
                ids: _this.getItemIds()
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    MessageBox.show('提示', '删除成功！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
                    _this.selectUsers('tpl-NAV01-SELECT');
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.updateUser = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('updateUser'),
            data: apiMain.getParams({
                id: $(_this.BTN_INSERT).attr('data-updateId'),
                real_name: $('input[name="name"]').val(),
                mobile_no: $('input[name="phone"]').val(),
                login_name: $('input[name="username"]').val(),
                login_pwd: $('input[name="password"]').val()
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    MessageBox.show('提示', '修改成功！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
                    _this.selectUsers('tpl-NAV01-SELECT');
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.selectUsers = function (templateId) {
        var _this = this;
        var pageSize = apiMain.selectUser.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectUser'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                realName: $('input[name="search"]').val() || ''
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataUpdate = function () {
        var _this = this;
        var templateHtml = '';
        $(document).on('click', this.BTN_UPDATE, function () {
            var templateId = $(this).parents('.content').attr('data-template');
            switch (templateId) {
                case 'tpl-NAV01-SELECT':
                    var itemId = $(this).attr('data-itemId').trim();
                    var itemName = $(this).attr('data-name').trim();
                    var itemPhone = $(this).attr('data-phone').trim();
                    var itemUsername = $(this).attr('data-username').trim();
                    var itemPassword = $(this).attr('data-password').trim();
                    var data = {
                        id: itemId,
                        name: itemName,
                        phone: itemPhone,
                        username: itemUsername,
                        password: itemPassword,
                        btnText: '保存'
                    };
                    templateHtml = template('tpl-NAV02-INSERT', data);
                    $(_this.TEMPLATE).html(templateHtml);
                    break;
                case 'tpl-NAV03-SELECT':
                    var itemId = $(this).attr('data-itemId').trim();
                    var itemNo = $(this).attr('data-no').trim();
                    var itemName = $(this).attr('data-name').trim();
                    var data = {
                        id: itemId,
                        no: itemNo,
                        name: itemName,
                        btnText: '保存'
                    };
                    templateHtml = template('tpl-NAV04-INSERT', data);
                    $(_this.TEMPLATE).html(templateHtml);
                    break;
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.insertMerchant = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('insertMerchant'),
            data: apiMain.getParams({
                merchant_no: $('input[name="merchantNo"]').val(),
                merchant_name: $('input[name="merchantName"]').val()
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    MessageBox.show('提示', '添加成功！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
                    _this.selectMerchant('tpl-NAV03-SELECT');
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.deleteMerchants = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('deleteMerchant'),
            data: apiMain.getParams({
                ids: _this.getItemIds()
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    MessageBox.show('提示', '删除成功！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
                    _this.selectMerchant('tpl-NAV03-SELECT');
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.updateMerchant = function () {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('updateMerchant'),
            data: apiMain.getParams({
                id: $(_this.BTN_INSERT).attr('data-updateId'),
                merchant_no: $('input[name="merchantNo"]').val(),
                merchant_name: $('input[name="merchantName"]').val()
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    MessageBox.show('提示', '修改成功！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
                    _this.selectMerchant('tpl-NAV03-SELECT');
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectMerchant = function (templateId) {
        var _this = this;
        var pageSize = apiMain.selectMerchant.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectMerchant'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                merchantName: $('input[name="search"]').val() || ''
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.getItemIds = function () {
        var ids = '';
        var $checkbox = $('tbody ' + this.CHECKBOX + ':checked');
        for (var i = 0; i < $checkbox.length; i++) {
            ids += $checkbox.eq(i).parents('tr').attr('data-itemId') + ',';
        }
        return ids;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.showSubNavigation = function () {
        var _this = this;
        $(document).on('click', this.NAV_ITEM, function (e) {
            e.stopPropagation();
            _this.pageCode = 1;
            var subNavigation = $(this).find(_this.NAV_BAR);
            if (subNavigation[0]) {
                $(_this.NAV_ITEM).not(this).removeClass(_this.ACTIVE);
                $(_this.NAV_ITEM).not(this).find(_this.NAV_BAR).slideUp();
                if ($(this).hasClass(_this.ACTIVE)) {
                    subNavigation.slideUp('fast');
                    $(this).removeClass(_this.ACTIVE);
                } else {
                    subNavigation.slideDown('fast');
                    $(this).addClass(_this.ACTIVE);
                }
            } else {
                var templateId = $(this).attr('data-template').trim();
                switch (templateId) {
                    case 'tpl-NAV01-SELECT':
                        _this.selectUsers(templateId);
                        break;
                    case 'tpl-NAV02-INSERT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV03-SELECT':
                        _this.selectMerchant(templateId);
                        break;
                    case 'tpl-NAV04-INSERT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV05-SELECT':
                        _this.selectMerchantRecord(templateId);
                        break;
                    case 'tpl-NAV06-SELECT':
                        _this.selectBankRecord(templateId);
                        break;
                    case 'tpl-NAV07-SELECT':
                        _this.selectCheckBase(templateId);
                        break;
                    case 'tpl-NAV08-SELECT':
                        _this.selectMisTake(templateId);
                        break;
                    case 'tpl-NAV09-SELECT':
                        _this.selectScratchPool(templateId);
                        break;
                    case 'tpl-NAV10-SELECT':
                        _this.selectFileStatus(templateId);
                        break;
                    case 'tpl-NAV11-SELECT':
                        _this.selectCheckBillLog(templateId);
                        break;
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.selectCheckBox = function () {
        var _this = this;
        $(document).on('click', this.CHECKBOX, function () {
            if ($(this).hasClass('all')) {
                if ($(this).prop('checked')) {
                    $(_this.CHECKBOX).prop('checked', true);
                } else {
                    $(_this.CHECKBOX).prop('checked', false);
                }
            } else {
                var offsetLength = $(_this.CHECKBOX).length
                    - $(_this.CHECKBOX + ':checked').length;
                if ($(this).prop('checked') && offsetLength <= 1) {
                    $(_this.CHECKBOX).eq(0).prop('checked', true);
                } else {
                    $(_this.CHECKBOX).eq(0).prop('checked', false);
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataDelete = function () {
        var _this = this;
        $(document).on('click', this.BTN_DELETE, function () {
            var templateId = $(this).parents('.content').attr('data-template');
            var length = $(_this.CHECKBOX + ':checked').length;
            if (length) {
                MessageBox.show('确认', '确认删除当前数据吗 ?', MessageBox.Buttons.OK_CANCEL, MessageBox.Icons.QUESTION);
                MessageBox.confirm(function () {
                    if ('tpl-NAV01-SELECT' === templateId) {
                        _this.deleteUsers();
                    } else if ('tpl-NAV03-SELECT' === templateId) {
                        _this.deleteMerchants();
                    }
                });
            } else {
                MessageBox.show('提示', '请选择需要删除的选项！', MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.btnReset = function () {
        $(document).on('click', this.BTN_RESET, function () {
            $('input').val('');
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.pagination = function () {
        var _this = this;
        $(document).on('click', '.pagination li', function () {
            var templateId = $(this).parents('.content').attr('data-template');
            if (!$(this).hasClass('disabled')) {
                var attr = $(this).find('a').attr('aria-label');
                if (undefined === attr) {
                    _this.pageCode = parseInt($(this).find('a').text());
                } else if ('Previous' === attr) {
                    _this.pageCode--;
                    _this.pageCode = _this.pageCode <= 1 ? 1 : _this.pageCode;
                } else if ('Next' === attr) {
                    _this.pageCode++;
                }
                switch (templateId) {
                    case 'tpl-NAV01-SELECT':
                        _this.selectUsers(templateId);
                        break;
                    case 'tpl-NAV03-SELECT':
                        _this.selectMerchant(templateId);
                        break;
                    case 'tpl-NAV05-SELECT':
                        _this.selectMerchantRecord(templateId);
                        break;
                    case 'tpl-NAV06-SELECT':
                        _this.selectBankRecord(templateId);
                        break;
                    case 'tpl-NAV07-SELECT':
                        _this.selectCheckBase(templateId);
                        break;
                    case 'tpl-NAV08-SELECT':
                        _this.selectMisTake(templateId);
                        break;
                    case 'tpl-NAV09-SELECT':
                        _this.selectScratchPool(templateId);
                        break;
                    case 'tpl-NAV10-SELECT':
                        _this.selectFileStatus(templateId);
                        break;
                    case 'tpl-NAV11-SELECT':
                        _this.selectCheckBillLog(templateId);
                        break;
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectMerchantRecord = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var payMethod = $('.dropdown>button').text().trim();
        var payName = '全部' === payMethod ? '' : payMethod;
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectMerchantRecord.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectMerchantRecord'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate,
                payName: payName
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['bill_date'];
                        data.data[i]['bill_date'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.payMethod = payMethod;
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectBankRecord = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var payMethod = $('.dropdown>button').text().trim();
        var payName = '全部' === payMethod ? '' : payMethod;
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectBankRecord.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectBankRecord'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate,
                payName: payName
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['bill_date'];
                        data.data[i]['bill_date'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.payMethod = payMethod;
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectCheckBase = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var payMethod = $('.dropdown>button').text().trim();
        var payName = '全部' === payMethod ? '' : payMethod;
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectCheckBase.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectCheckBase'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate,
                payName: payName
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['bill_date'];
                        data.data[i]['bill_date'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.payMethod = payMethod;
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectMisTake = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var payMethod = $('.dropdown>button').text().trim();
        var payName = '全部' === payMethod ? '' : payMethod;
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectMisTake.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectMisTake'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate,
                payName: payName
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['billDate'];
                        data.data[i]['billDate'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.payMethod = payMethod;
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectScratchPool = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var payMethod = $('.dropdown>button').text().trim();
        var payName = '全部' === payMethod ? '' : payMethod;
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectScratchPool.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectScratchPool'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate,
                payName: payName
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['bill_date'];
                        data.data[i]['bill_date'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.payMethod = payMethod;
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectFileStatus = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectFileStatus.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectFileStatus'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['bill_date'];
                        data.data[i]['bill_date'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @param templateId
     * @returns {HomePage}
     */
    HomePage.prototype.selectCheckBillLog = function (templateId) {
        var _this = this;
        var startTime = $('input[name="startTime"]').val() || '';
        var stopTime = $('input[name="stopTime"]').val() || '';
        var beginDate = common.dateFormat(startTime, 'yyyyMMdd');
        var endDate = common.dateFormat(stopTime, 'yyyyMMdd');
        var pageSize = apiMain.selectCheckBillLog.params.pageSize;
        $.ajax({
            url: apiMain.getUrl('selectCheckBillLog'),
            data: apiMain.getParams({
                pageIndex: _this.pageCode,
                pageSize: pageSize,
                beginDate: beginDate,
                endDate: endDate
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
                    if (!common.ajaxDataIsExist(data.data))return;
                    for (var i = 0; i < data.data.length; i++) {
                        var tempTime = data.data[i]['bill_date'];
                        data.data[i]['bill_date'] = common.dateFormat(tempTime, 'yyyy-mm-dd');
                        tempTime = data.data[i]['complete_time'];
                        data.data[i]['complete_time'] = common.parseDate(tempTime);
                    }
                    data.startTime = startTime;
                    data.stopTime = stopTime;
                    data.pageCode = _this.pageCode;
                    data.totalPage = Math.ceil(data.count / pageSize);
                    var templateHtml = template(templateId, data);
                    $(_this.TEMPLATE).html(templateHtml);
                }
            }
        });
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataSelect = function () {
        var _this = this;
        $(document).on('click', this.BTN_SELECT, function () {
            _this.pageCode = 1;
            var templateId = $(this).parents('.content').attr('data-template');
            switch (templateId) {
                case 'tpl-NAV01-SELECT':
                    _this.selectUsers(templateId);
                    break;
                case 'tpl-NAV03-SELECT':
                    _this.selectMerchant(templateId);
                    break;
                case 'tpl-NAV05-SELECT':
                    _this.selectMerchantRecord(templateId);
                    break;
                case 'tpl-NAV06-SELECT':
                    _this.selectBankRecord(templateId);
                    break;
                case 'tpl-NAV07-SELECT':
                    _this.selectCheckBase(templateId);
                    break;
                case 'tpl-NAV08-SELECT':
                    _this.selectMisTake(templateId);
                    break;
                case 'tpl-NAV09-SELECT':
                    _this.selectScratchPool(templateId);
                    break;
                case 'tpl-NAV10-SELECT':
                    _this.selectFileStatus(templateId);
                    break;
                case 'tpl-NAV11-SELECT':
                    _this.selectCheckBillLog(templateId);
                    break;
            }
        });
        return this;
    };
    /**
     *
     * @type {HomePage}
     */
    var homePage = new HomePage();
});
