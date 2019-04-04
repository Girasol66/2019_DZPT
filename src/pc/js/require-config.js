require.config({
    baseUrl: '../',
    paths: {
        common: 'js/common',
        jquery: 'libs/jquery/jquery-1.12.4.min',
        bootstrap: 'libs/bootstrap/bootstrap.min',
        bootstrapDateTimePicker: 'libs/bootstrap-dateTimePicker/bootstrap-datetimepicker.min',
        bootstrapDateTimePickerLocal_zh_CN: 'libs/bootstrap-dateTimePicker/locales/bootstrap-datetimepicker.zh-CN',
        echarts: 'libs/echarts/echarts.min',
        template: 'libs/template/template.min',
        waves: 'libs/waves/waves',
        apiMain: 'js/apiMain',
        MessageBox: 'js/messageBox',
        Toast: 'js/toast',
        Blob: 'libs/export/Blob',
        FileSaver: 'libs/export/FileSaver',
        tableExport: 'libs/export/tableExport'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapDateTimePicker: {
            deps: ['jquery', 'bootstrap']
        },
        bootstrapDateTimePickerLocal_zh_CN: {
            deps: ['jquery', 'bootstrap', 'bootstrapDateTimePicker']
        },
        tableExport: {
            deps:['Blob', 'FileSaver']
        }
    },
    waitSeconds: 10,
    urlArgs: 'v={{version}}'
});
