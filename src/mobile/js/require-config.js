require.config({
  baseUrl: '../',
  paths: {
    common: 'js/common',
    jquery: 'libs/jquery/jquery-1.12.4.min',
    template: 'libs/template/template.min',
    echarts: 'libs/echarts/echarts.min',
    fastclick: 'libs/fastclick/fastclick',
    swiper: 'libs/swiper/swiper.min'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    }
  },
  waitSeconds: 10,
  urlArgs: 'v={{version}}'
});