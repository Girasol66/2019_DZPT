require(['jquery', 'common', 'template', 'MessageBox', 'waves', 'apiMain', 'bootstrapDateTimePicker', 'bootstrapDateTimePickerLocal_zh_CN'], function ($, common, template, MessageBox, waves, apiMain) {
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
        this.BTN_EDIT = args['BTN_EDIT'] ? args['BTN_EDIT'] : '.btn-edit';
        this.DATE_SEL = args['DATE_SEL'] ? args['DATE_SEL'] : '.form-date';
        this.BTN_RESET = args['BTN_RESET'] ? args['BTN_RESET'] : '.btn-reset';
        this.DROP_ITEM = args['DROP_ITEM'] ? args['DROP_ITEM'] : '.dropdown li';
        this.BTN_INSERT = args['BTN_INSERT'] ? args['BTN_INSERT'] : '.btn-insert';
        this.BTN_DELETE = args['BTN_DELETE'] ? args['BTN_DELETE'] : '.btn-delete';

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
        this.dataDelete();
        this.dataRender();
        this.selectUsers('tpl-NAV01-SELECT');
        this.updateUser();
        this.pagination();
        this.btnReset();
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataRender = function () {
        var store = JSON.parse(localStorage.getItem('store'));
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
    HomePage.prototype.dateTimePickerInit = function () {
        $(this.DATE_SEL).datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            minView: 'month',
            autoclose: true
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
                login_pwd: $('input[name="password"]').val(),
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
        $(document).on('click', this.BTN_EDIT, function () {
            var itemId = $(this).attr('data-itemId').trim();
            MessageBox.show('提示', '当前点击的选项ID是:' + itemId, MessageBox.Buttons.OK, MessageBox.Icons.INFORMATION);
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
                pageSize: pageSize
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
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
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV04-INSERT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV05-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV06-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV07-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV08-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV09-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV10-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                    case 'tpl-NAV11-SELECT':
                        var templateHtml = template(templateId, {});
                        $(_this.TEMPLATE).html(templateHtml);
                        break;
                }
                _this.dateTimePickerInit();
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
            var length = $(_this.CHECKBOX + ':checked').length;
            if (length) {
                MessageBox.show('确认', '确认删除当前数据吗 ?', MessageBox.Buttons.OK_CANCEL, MessageBox.Icons.QUESTION);
                MessageBox.confirm(function () {
                    _this.deleteUsers();
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
                _this.selectUsers('tpl-NAV01-SELECT');

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
