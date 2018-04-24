define(['jquery', 'apisMain', 'echarts', '003_QDYH'], function ($, apisMain, echarts) {
  //  解析url参数
  var parseSearchString = function (str) {
    str = str.indexOf('?') > -1 ? str.slice(str.indexOf('?') + 1) : str;
    var items = str.split('&');
    var result = {};
    
    for (var i = 0; i < items.length; i++) {
      var arr = items[i].split('=');
      if (arr[0]) {
        result[arr[0]] = arr[1];
      }
    }
    
    return result;
  };
  
  //  拼接获取接口地址
  var getApiUrl = apisMain.apis.QDYH.getURL.bind(apisMain.apis.QDYH);
  
  //  判断请求成功时是否有返回值
  var ajaxDataIsExist = function (data) {
    return !!(typeof data === 'string' || data instanceof Array && data.length || !(data instanceof Array) && data);
  };
  
  //  渲染通用的ajax的加载中、无数据、接口出错的内容块
  var renderAjaxBox = function (el) {          //  渲染loading、无数据、请求失败到dom节点上
    var $wrappers = null;                 //  存储dom节点的jquery对象，转化成一个数组，方便操作
    var wraperHtmlStr = '<div class="common__ajaxBox__wrapper vertical text-center"></div>';
    if (el instanceof Array) {
      $wrappers = el.map(function (item) {
        var $wrapper = $(wraperHtmlStr);
        $(item).html($wrapper);
        return $wrapper;
      });
    } else {
      var $wrapper = $(wraperHtmlStr);
      $(el).html($wrapper);
      $wrappers = [$wrapper];
    }
    var $ajaxBox = null;            //   存储ajaxBox的jquery对象
    var loadingTimer = null;        //   存储定时器id，用于短暂延迟后才渲染loading，避免接口加载时间太短闪屏
    var loadingHtml = '<div class="common__ajaxBox loading">' +
        '<span>努力加载中...</span>' +
        '</div>';
    var noDataHtml = '<div class="common__ajaxBox noData">' +
        '<span>无数据</span>' +
        '</div>';
    var errorHtml = '<div class="common__ajaxBox error">' +
        '<span>请求失败了！</span>' +
        '</div>';
    return {
      get$ajaxBox: function () {
        return $ajaxBox;
      },
      init: function () {
        $ajaxBox = $(loadingHtml);
        $ajaxBox.hide();
        $wrappers.map(function ($el) {
          $el.html($ajaxBox);
        });
        return this;
      },
      showLoading: function () {
        if (!$ajaxBox) {
          this.init();
        }
        loadingTimer && clearTimeout(loadingTimer);
        loadingTimer = setTimeout(function () {
          $ajaxBox.show();
        }, 250);
        return this;
      },
      hideLoading: function () {
        if ($ajaxBox.hasClass('loading')) {
          loadingTimer && clearTimeout(loadingTimer);
          $ajaxBox.hide();
        }
        return this;
      },
      showNoData: function () {
        $ajaxBox = $(noDataHtml);
        $wrappers.map(function ($el) {
          $el.html($ajaxBox);
        });
      },
      showError: function () {
        $ajaxBox = $(errorHtml);
        $wrappers.map(function ($el) {
          $el.html($ajaxBox);
        });
      }
    };
  };
  
  //  初始化图表
  var echartsInstances = [];
  function echartsResizeHandler() {
    setTimeout(function () {
      echartsInstances.forEach(function (echartsInstance) {
        echartsInstance && echartsInstance.resize();
      });
    }, 0);
  }
  $(window).on('resize', echartsResizeHandler);
  var initChart = function (el, option) {
    var dom = $(el)[0];
    var myChart = null;
    if (echarts.getInstanceByDom(dom)) {
      myChart = echarts.getInstanceByDom(dom);
      myChart.dispose();
      echartsInstances.forEach(function (echartsInstance, i) {
        if (echartsInstance === myChart) {
          echartsInstances.splice(i, 1);
        }
      })
    }
    myChart = echarts.init($(el)[0]);
    myChart.setOption(option);
    echartsInstances.push(myChart);
    return myChart;
  };
  
  //  过滤返回值html字符串中的<script>和</script>
  function filterScriptTag(htmlStr) {
    if (!htmlStr || typeof htmlStr !== 'string'){
      return htmlStr;
    }
    return htmlStr.replace(/<script.*?>.*?<\/script>/ig, '');
  }
  
  //  一些通用的直接执行的逻辑处理
  (function () {
    //  给jquery的实例扩展添加浏览器厂商前缀的style样式方法
    var pfx = (function () {
      var style = document.createElement('dummy').style,
          prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
          memory = {};
      
      function _pfx(prop) {
        if (typeof memory[prop] === 'undefined') {
          var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
              props = [prop].concat(prefixes.map(function (prefix) {
                return prefix + ucProp;
              }));
          memory[prop] = null;
          for (var i in props) {
            if (style[props[i]] !== undefined) {
              memory[prop] = props[i];
              break;
            }
          }
        }
        return memory[prop];
      }
      
      return _pfx;
    })();
    var addStyleWithPrefix = function (props) {
      var el = this[0];
      for (var key in props) {
        var pkey = pfx(key);
        if (pkey !== null) el.style[pkey] = props[key];
      }
      return el;
    };
    $.fn.extend({
      addStyleWithPrefix: addStyleWithPrefix
    });
    
    //  设置$.ajax的默认配置
    var ajaxConfig = apisMain.apis.QDYH.ajaxConfig;
    $.ajaxSetup({
      method: ajaxConfig.method,
      headers: ajaxConfig.headers,
      dataType: 'json',
      timeout: ajaxConfig.timeout
    });
    
    //  监听jquery的ajax事件,做一些通用处理
    $(document)
        .ajaxSend(function (event, xhr, settings) {         //  ajax发送时的事件
          var ajaxBox = renderAjaxBox(settings.$renderContainer);
          settings.ajaxBox = ajaxBox;
          ajaxBox.showLoading();
        })
        .ajaxSuccess(function (event, xhr, settings, rawData) {      //  ajax成功时的事件
          //  如果没有数据，就填充无数据提示到指定容器
          var data = rawData.data;
          if (!ajaxDataIsExist(data)) {
            var ajaxBox = settings.ajaxBox;
            ajaxBox.showNoData();
          }
        })
        .ajaxError(function (event, xhr, settings) {        //  ajax错误时的事件
          var ajaxBox = settings.ajaxBox;
          console.log('接口出错了');
        })
        .ajaxComplete(function (event, xhr, settings) {     //  ajax完成时的事件
          var ajaxBox = settings.ajaxBox;
          ajaxBox.hideLoading();
        });
    
    //  给template增加一些格式化数据的方法
    //  todo: ...
  })();
  
  return {
    parseSearchString: parseSearchString,
    getApiUrl: getApiUrl,
    ajaxDataIsExist: ajaxDataIsExist,
    renderAjaxBox: renderAjaxBox,
    initChart: initChart,
    filterScriptTag: filterScriptTag
  };
});
