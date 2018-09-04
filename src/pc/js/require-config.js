require.config({
    baseUrl: '../',
    paths: {
        common: 'js/common',
        jquery: 'libs/jquery/jquery-1.12.4.min',
        bootstrap: 'libs/bootstrap/bootstrap.min',
        bootstrapDatePicker: 'libs/bootstrap-datepicker/bootstrap-datepicker',
        bootstrapDatePickerLocale_cn: 'libs/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN',
        echarts: 'libs/echarts/echarts.min',
        template: 'libs/template/template.min',
        waves: 'libs/waves/waves'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapDatePickerLocale_cn: {
            deps: ['jquery']
        }
    },
    waitSeconds: 10,
    urlArgs: 'v={{version}}'
});
