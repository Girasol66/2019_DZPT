require(['jquery', 'common', 'template', 'MessageBox', 'waves', 'apiMain', 'bootstrapDateTimePicker', 'bootstrapDateTimePickerLocal_zh_CN'], function ($, common, template, MessageBox, waves, apiMain) {
    /**
     *
     * @constructor
     */
    function HomePage() {
        var args = arguments.length ? arguments.length[0] : arguments;
        this.ACTIVE = args['ACTIVE'] ? args['ACTIVE'] : 'active';
        this.NAV_BAR = args['NAV_BAR'] ? args['NAV_BAR'] : '.nav-bar';
        this.NAV_ITEM = args['NAV_ITEM'] ? args['NAV_ITEM'] : '.nav-item';
        this.TEMPLATE = args['TEMPLATE'] ? args['TEMPLATE'] : '.template';
        this.CHECKBOX = args['CHECKBOX'] ? args['CHECKBOX'] : '.checkbox';
        this.BTN_EDIT = args['BTN_EDIT'] ? args['BTN_EDIT'] : '.btn-edit';
        this.DATE_SEL = args['DATE_SEL'] ? args['DATE_SEL'] : '.form-date';
        this.DROP_ITEM = args['DROP_ITEM'] ? args['DROP_ITEM'] : '.dropdown li';

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
        return this;
    };
    /**
     *
     * @returns {HomePage}
     */
    HomePage.prototype.dataRender = function () {
        var store = JSON.parse(localStorage.getItem('store'));
        $('.name').text('当前用户：【' + store.username + '】');
        // $(this.NAV_ITEM + '[data-template="tpl-NAV01-SELECT"]').click();
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
    HomePage.prototype.selectUsers = function (templateId) {
        var _this = this;
        $.ajax({
            url: apiMain.getUrl('selectUser'),
            data: apiMain.getParams({
                pageIndex: 1,
                pageSize: 10
            }),
            $renderContainer: $('.table-content'),
            success: function (data) {
                if (data.code !== this.ERR_NO) {
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
    HomePage.prototype.showSubNavigation = function () {
        var _this = this;
        $(document).on('click', this.NAV_ITEM, function (e) {
            e.stopPropagation();
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
        $(document).on('click', '.btn-danger', function () {
            MessageBox.show('确认', '确认删除当前数据吗 ?', MessageBox.Buttons.OK_CANCEL, MessageBox.Icons.QUESTION);
            MessageBox.confirm(function () {
                console.log("CONFIRM");
            })
        });
        return this;
    };
    /**
     *
     * @type {HomePage}
     */
    var homePage = new HomePage();
});
