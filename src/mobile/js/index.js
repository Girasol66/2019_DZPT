require(['jquery', 'common', 'template', 'echarts', 'fastclick', 'swiper'], function ($, common, template, echarts, fastclick, swiper) {
  //  从url中获取的参数
  var queryParams = common.parseSearchString(window.location.search);
  //  存储基金基本信息的数据，避免多次调用
  var fundInfoData = null;
  //  首先需要获取基金基本信息，判断基金类型是否股票型
  function loadFundInfo($renderContainer, successFunc) {
    if (typeof $renderContainer === 'function') {
      successFunc = $renderContainer;
      $renderContainer = undefined;
    }
    if (fundInfoData) {
      successFunc && successFunc(fundInfoData);
      return;
    }
    
    $.ajax({
      url: common.getApiUrl('getFundInfo', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $renderContainer,
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        fundInfoData = data[0];
        successFunc && successFunc(fundInfoData);
      }
    });
  };
  
  var active = 'active';//定义选中状态类名
  var btnBar = '.btn-bar';//净值走势趋势图底部切换按钮类名
  var mySwiper = null;//swiper实例变量
  var tabBar = '.tab-bar';//顶部选项卡按钮类名
  var moveBar = '.border';//定义顶部选项卡状态条类名
  var tabItem = '.tab-item';//定义顶部选项卡切换按钮类名
  var JZZS_DATA = [
    {
      name: '本基金',
      flag: false,
      data: []
    }
    // {
    //   name: '沪深300',
    //   flag: false,
    //   data: []
    // },
    // {
    //   name: '同类均值',
    //   flag: false,
    //   data: []
    // }
  ];//初始化基金走势趋势图对象
  var JZZS_CHART = [];//定义基金走势趋势图数据
  
  $(function () {
    fastclick.attach(document.body);
    loadFundInfo(function (data) {
      var fundType = data.fundType;
      if (fundType === '货币型') {
        $('#tab_1').html('万份收益');
        $('#JZZS .fundType').html('万份收益');
      } else {
        $('#tab_1').html('净值走势');
        $('#JZZS .fundType').html('净值');
      }
      
      initSwiper();
      tabChange();
      initBorder();
      chartFilter();
      ajaxForJZZS();
      btnMoreJJGK();
      
    });
  });
  //格式化Y轴数据
  function parseData(name, params) {
    var tempObj = null;
    switch (name) {
      case 'JZZS':
        tempObj = {
          x: [],
          y: []
        };
        for (var i = 0; i < params.length; i++) {
          tempObj['y'][i] = {};
          tempObj['y'][i]['name'] = params[i]['name'];
          tempObj['y'][i]['type'] = 'line';
          tempObj['y'][i]['stack'] = '总量';
          tempObj['y'][i]['symbolSize'] = 0;
          tempObj['y'][i]['smooth'] = true;
          tempObj['y'][i]['data'] = [];
          if (params[i]['data'].length > 0) {
            tempObj['x'] = [];
            for (var j = 0; j < params[i]['data'].length; j++) {
              var tempData = params[i]['data'][j];
              tempObj['x'].push(tempData['endDate']);
              tempObj['y'][i]['data'].push(tempData['fundNav']);
            }
          }
        }
        break;
    }
    return tempObj;
  };
  //编写基金走势EChart所需的Option并渲染EChart
  function JZZSEChart(params) {
    var extraCssText = 'width:100%;padding:0px;'
        + 'text-align:center;background-color:'
        + 'transparent;font-size:10px;color:rgb(102,102,102);';
    
    var XAXIS_DATA = params['x'];
    var SERIES_DATA = params['y'];
    
    var minValue = Math.min.apply(null, SERIES_DATA[0]['data']);
    var maxValue = Math.max.apply(null, SERIES_DATA[0]['data']);
    
    var option = {
      tooltip: {
        trigger: 'axis',
        position: [0, 0],
        transitionDuration: 0,
        alwaysShowContent: true,
        extraCssText: extraCssText,
        formatter: function (params) {
          var templateHtml = '<div class="row tooltip">';
          for (var i = 0; i < params.length; i++) {
            templateHtml += '<div class="col-xs-4 item">'
                + '<i style="border-color:'
                + params[i]['color'] + '"></i><span>'
                + params[i]['seriesName'] + ':'
                + params[i]['value'] + '</span></div>';
          }
          templateHtml += '</div>';
          return templateHtml;
        }
      },
      grid: {
        top: '25%',
        left: '3%',
        right: '10%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          margin: 15
        },
        data: XAXIS_DATA
      },
      yAxis: {
        type: 'value',
        min: minValue,
        max: maxValue,
        interval: (maxValue - minValue) / 3,
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(2);
          }
        }
      },
      series: SERIES_DATA,
      color: [
        '#419AFF',
        '#FD9E2A',
        '#FF5434'
      ]
    };
    
    var myChart = common.loadEChart('#JZZS_CHART', option);
    myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: XAXIS_DATA.length - 1
    });
  };
  //编写投资组合EChart所需的Option并渲染EChart
  function TZZHEChart(params) {
    var LEGEND_DATA = [];
    var SERIES_DATA = [];
    for (var i = 0; i < params['distribution'].length; i++) {
      var tempObj = params['distribution'][i];
      LEGEND_DATA.push(tempObj['industry']);
      SERIES_DATA.push({
        'name': tempObj['industry'],
        'value': tempObj['amount'],
        'amountRate': tempObj['amountRate']
      });
    }
    var option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      color: [
        '#FFC49C', '#FFB24D',
        '#FF8686', '#DCAAFF',
        '#419BFE', '#c23531',
        '#2f4554', '#61a0a8',
        '#d48265', '#91c7ae'
      ],
      legend: {
        orient: 'horizontal',
        bottom: 10,
        itemWidth: 8,
        itemHeight: 8,
        data: LEGEND_DATA
      },
      series: [
        {
          type: 'pie',
          radius: '35%',
          label: {
            show: true,
            formatter: function (params) {
              var rate = params['data']['amountRate'] + '%';
              return rate;
            }
          },
          center: ['50%', '35%'],
          selectedMode: 'single',
          data: SERIES_DATA,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    common.loadEChart('#TZZH_CHART', option);
  };
  //初始化swiper插件
  function initSwiper() {
    mySwiper = new swiper('.swiper-container', {
      noSwiping: true,
      autoHeight: true,
      initialSlide: 0,
      onSlideChangeStart: function (swiper) {
        $(tabItem).removeClass(active);
        $(tabItem).eq(swiper.activeIndex).addClass(active);
        var iWidth = $(tabItem).eq(swiper.activeIndex).outerWidth();
        var scrollLeft = $(tabBar).scrollLeft();
        var offsetLeft = $(tabItem).eq(swiper.activeIndex).offset().left;
        $(moveBar).addStyleWithPrefix({
          'width': iWidth + 'px',
          'transform': 'translateX(' + (offsetLeft + scrollLeft) + 'px)'
        });
        loadModule(swiper.activeIndex);
      }
    });
  };
  //根据模块是否加载调取不同Ajax此处调用在tabChange方法里
  function loadModule(params) {
    var dataLoaded = $(tabItem + '.active').attr('data-loaded');
    switch (params) {
      case 0:
        if ('false' === dataLoaded) ajaxForJZZS();
        break;
      case 1:
        if ('false' === dataLoaded) ajaxForJJGK();
        break;
      case 2:
        if ('false' === dataLoaded) ajaxForFLJG();
        break;
      case 3:
        if ('false' === dataLoaded) ajaxForTZZH();
        break;
      case 4:
        if ('false' === dataLoaded) ajaxForJYGZ();
        break;
    }
    $(tabItem + '.active').attr('data-loaded', 'true');
  };
  //选项卡切换功能
  function tabChange() {
    $(document).on('click', tabItem, function () {
      var iWidth = $(this).outerWidth();
      var offsetLeft = $(this).offset().left + $(tabBar).scrollLeft();
      $(moveBar).addStyleWithPrefix({
        'width': iWidth + 'px',
        'transform': 'translateX(' + offsetLeft + 'px)'
      });
      $(tabItem).not(this).removeClass(active);
      $(this).addClass(active);
      mySwiper.slideTo($(this).index(), 300, false);
      
      loadModule($(this).index());
    });
  };
  //初始化选项卡状态条位置
  function initBorder() {
    var scrollLeft = $(tabBar).scrollLeft();
    var iWidth = $(tabItem + '.active').outerWidth();
    var offsetLeft = $(tabItem + '.active').offset().left;
    $(moveBar).addStyleWithPrefix({
      'width': iWidth + 'px',
      'transform': 'translateX(' + scrollLeft + offsetLeft + 'px)'
    });
  };
  //筛选基金走势趋势图
  function chartFilter() {
    $(document).on('click', btnBar, function () {
      $(btnBar).not(this).removeClass(active);
      $(this).addClass(active);
      ajaxForJZZS();
    });
  };
  //ajax获取基金走势趋势图数据
  function ajaxForJZZS() {
    var conType = parseInt($(btnBar + '.active').index() + 1);
    if (!JZZS_CHART[conType]) {
      for (var i = 0; i < JZZS_DATA.length; i++) {
        (function (index) {
          $.ajax({
            url: common.getApiUrl('getFundIopuTrend', {
              fundCode: queryParams.fundCode,
              conType: conType,
              choiceCode: index + 1
            }),
            $renderContainer: $('#JZZS_CHART'),
            success: function (rawData) {
              var data = rawData.data;
              if (common.ajaxDataIsExist(data)) {
                JZZS_DATA[index].data = data;
              }
            },
            complete: function (xhr) {
              JZZS_DATA[index].flag = true;
              var result = true;
              for (var j = 0; j < JZZS_DATA.length; j++) {
                if (!JZZS_DATA[j]['flag']) {
                  result = false;
                }
              }
              if (result) {
                var tempObj = parseData('JZZS', JZZS_DATA);
                if (tempObj['x'].length !== 0 && tempObj['y'].length !== 0) {
                  JZZS_CHART[conType] = tempObj;
                  JZZSEChart(tempObj);
                  mySwiper.onResize();
                }
              }
            }
          });
        })(i);
      }
    } else {
      JZZSEChart(JZZS_CHART[conType]);
    }
  };
  //ajax获取基金概况数据
  function ajaxForJJGK() {
    $.ajax({
      url: common.getApiUrl('getFundInfo', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $('#JJGK_JBZL'),
      success: function (rawData) {
        var data = rawData.data;
        data[0]['saleOrgNArray'] = data[0]['saleOrgN'].split('|');
        console.log(data);
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-JJGK_JBZL', data[0]);
        this.$renderContainer.html(htmlStr);
        mySwiper.onResize();
      }
    });
    
    $.ajax({
      url: common.getApiUrl('getFundManager', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $('#JJGK_JJJL'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-JJGK_JJJL', rawData);
        this.$renderContainer.html(htmlStr);
        mySwiper.onResize();
      }
    });
  };
  //ajax获取费率结构数据
  function ajaxForFLJG() {
    $.ajax({
      url: common.getApiUrl('getFundStructureDate', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $('#FLJG'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-FLJG', dataError(data[0]));
        this.$renderContainer.html(htmlStr);
        mySwiper.onResize();
      }
    });
  };
  //ajax获取投资组合数据
  function ajaxForTZZH() {
    $.ajax({
      url: common.getApiUrl('getFundAssallocation', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $('#TZZH_ZCFB'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-TZZH_ZCFB', data[0]);
        this.$renderContainer.html(htmlStr);
        mySwiper.onResize();
      }
    });
    
    $.ajax({
      url: common.getApiUrl('getFundIndustry', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $('#TZZH_HYFB'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-TZZH_HYFB', data[0]);
        this.$renderContainer.html(htmlStr);
        TZZHEChart(data[0]);
        mySwiper.onResize();
      }
    });
  };
  //ajax获取交易规则数据
  function ajaxForJYGZ() {
    $.ajax({
      url: common.getApiUrl('getFundStructureDate', {
        fundCode: queryParams.fundCode
      }),
      $renderContainer: $('#JYGZ'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-JYGZ', dataError(data[0]));
        this.$renderContainer.html(htmlStr);
        mySwiper.onResize();
      }
    });
  };
  //基金概况销售机构查看更多
  function btnMoreJJGK() {
    var iSwitch = false;
    $(document).on('click', '.btn-more', function () {
      setTimeout(function () {
        mySwiper.onResize();
      }, 300);
      if (iSwitch) {
        $(this).text('更多>>');
        $(this).parent().css('height', 0.3 + 'rem');
        iSwitch = false;
      } else {
        $(this).text('收起>>');
        var iHeight = $(this).prev().outerHeight();
        $(this).parent().css('height', iHeight + 'px');
        iSwitch = true;
      }
    });
  }
  
  function dataError(params) {
    for (var key in params) {
      params[key] = params[key] || {};
      if (params[key]['th']) {
        params[key]['line'] = [];
        params[key]['line'][0] = [];
        params[key]['line'][0][0] = params[key]['th'].join('');
        delete params[key].th;
      }
    }
    console.log(params);
    return params;
  }
});
