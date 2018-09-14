define(['jquery', 'apisMain', 'echarts', '003_QDYH'], function ($, apisMain, echarts) {
  /**
   *
   * @constructor
   */
  function Common() {
    var arguments = arguments.length !== 0 ? arguments[0] : arguments;
    this.selector = arguments['selector'] ? arguments['selector'] : 'html';
    
    this.init();
  }
  
  var echartsInstances = [];
  function echartsResizeHandler() {
    setTimeout(function () {
      echartsInstances.forEach(function (echartsInstance) {
        echartsInstance && echartsInstance.resize();
      });
    }, 0);
  }
  $(window).on('resize', echartsResizeHandler);
  
  Common.prototype = {
    constructor: Common,
    init: function () {
      var _this = this;
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
      
      function addStyleWithPrefix(props) {
        var el = this[0];
        for (var key in props) {
          var pkey = pfx(key);
          if (pkey !== null) el.style[pkey] = props[key];
        }
        return el;
      }
      
      $.fn.extend({
        addStyleWithPrefix: addStyleWithPrefix
      });
      
      //  设置html文字大小
      this.setFontSize();
      
      //  设置$.ajax的默认配置
      var ajaxConfig = apisMain.apis.QDYH.ajaxConfig;
      $.ajaxSetup({
        method: ajaxConfig.method,
        headers: ajaxConfig.headers,
        dataType: 'json',
        timeout: ajaxConfig.timeout
      });
      //  监听ajax事件
      $(document)
          .ajaxSend(function (event, xhr, settings) {         //  ajax发送时的事件
            var ajaxBox = _this.renderAjaxBox(settings.$renderContainer);
            settings.ajaxBox = ajaxBox;
            ajaxBox.showLoading();
          })
          .ajaxSuccess(function (event, xhr, settings, rawData) {      //  ajax成功时的事件
            //  如果没有数据，就填充无数据提示到指定容器
            var data = rawData.data;
            if (!_this.ajaxDataIsExist(data)) {
              var ajaxBox = settings.ajaxBox;
              ajaxBox.showNoData();
            }
          })
          .ajaxError(function (event, xhr, settings) {        //  ajax错误时的事件
            var ajaxBox = settings.ajaxBox;
          })
          .ajaxComplete(function (event, xhr, settings) {     //  ajax完成时的事件
            var ajaxBox = settings.ajaxBox;
            ajaxBox.hideLoading();
          });
      //
      return this;
    },
    setFontSize: function () {
      var _this = this;
      var iFontSize = $(window).width() / 3.75 + 'px';
      $(_this.selector).css('fontSize', iFontSize);
      $(window).resize(function () {
        var iFontSize = $(window).width() / 3.75 + 'px';
        $(_this.selector).css('fontSize', iFontSize);
      });
      document.body.addEventListener('touchstart', function () {
      });
      return this;
    },
    loadEChart: function (el, option) {
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
    },
    getApiUrl: apisMain.apis.QDYH.getURL.bind(apisMain.apis.QDYH),
    ajaxDataIsExist: function (data) {
      return !!(typeof data === 'string'
      || data instanceof Array && data.length
      || !(data instanceof Array) && data);
    },
    renderAjaxBox: function (el) {          //  渲染loading、无数据、请求失败到dom节点上
      var $wrappers = null;                 //  存储dom节点的jquery对象，转化成一个数组，方便操作
      var $ajaxBox = null;     //   存储ajaxBox的jquery对象
      var timer = null;        //   存储定时器id，用于延时渲染，避免接口加载时间太短闪屏
      var wraperHtmlStr = '<div class="common__ajaxBox__wrapper vertical text-center"></div>';
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
          timer && clearTimeout(timer);
          timer = setTimeout(function () {
            $ajaxBox.show();
          }, 250);
          return this;
        },
        hideLoading: function () {
          if ($ajaxBox.hasClass('loading')) {
            timer && clearTimeout(timer);
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
    },
    parseSearchString: function (searchString) {
      var str = searchString.slice(1);
      var items = str.split('&');
      var result = {};
      for (var i = 0; i < items.length; i++) {
        var arr = items[i].split('=');
        if (arr[0]) {
          result[arr[0]] = arr[1];
        }
      }
      return result;
    }
  };
  
  return new Common();
});