require(['jquery', 'common', 'template'], function ($, common, template) {
  
  var XHR_JJXX = null;
  var pageCode = 0;
  var pageSize = 10;
  
  var params = {
    fundCode: 'all',
    startIndex: (pageCode * pageSize) + 1,
    itemCount: pageSize,
    saleOrg: '1'
  };
  
  $(function () {
    loadFundCompany();
    loadBasicInfo();
    loadBasicInfoFilter();
    btnMoreClick();
    btnClearClick();
    btnCloseItem();
    loadBasicInfoSort();
    pagination();
    loadAnnounce();
    loadFundRecommend();
    addEventListerFundSearch();
    loadFundHotSearch();
    tabChangeFundList();
  });
  
  function loadBasicInfo() {
    params = getParams();
    XHR_JJXX && XHR_JJXX.abort();
    var selector = '.page-btn.home,.page-btn.prev';
    if (pageCode <= 0) {
      $(selector).addClass('disable');
    } else {
      $(selector).removeClass('disable');
    }
    XHR_JJXX = $.ajax({
      url: common.getApiUrl('getFundIncomeInfo', params),
      $renderContainer: $('#CONTENT_INFO'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-CONTENT_INFO', parseData(rawData));
        this.$renderContainer.html(htmlStr);
        if (data) {
          if (data.length === params['itemCount']) {
            $('.page-btn.next').removeClass('disable');
          } else {
            $('.page-btn.next').addClass('disable');
          }
        } else {
          $('.page-btn.next').addClass('disable');
        }
      }
    });
  }
  
  function parseData(params) {
    var CONST_ATTR = [
      'dayIncome',
      'sdayIncome',
      'oneMincome',
      'sixMincome',
      'ayearIncome',
      'thisYearIncome'
    ];
    var CONST_INDEX = $('.sort-item.active').index();
    if (params['data'] instanceof Array && params['data'].length !== 0) {
      for (var i = 0; i < params['data'].length; i++) {
        params['data'][i]['rate'] = params['data'][i][CONST_ATTR[CONST_INDEX]];
      }
    }
    return params;
  }
  
  function loadFundCompany() {
    $.ajax({
      url: common.getApiUrl('getFundCompany', params),
      $renderContainer: $('#fundComCode'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-fundComCode', rawData);
        this.$renderContainer.html(htmlStr);
      }
    });
  }
  
  function btnMoreClick() {
    $(document).on('click', '.btn-more', function () {
      if ($(this).prev().hasClass('hide')) {
        $(this).html('收起')
               .prev()
               .removeClass('hide');
      } else {
        $(this).html('更多')
               .prev()
               .addClass('hide');
      }
    });
  }
  
  function btnClearClick() {
    $(document).on('click', '.btn-clean', function () {
      pageCode = 0;
      $('.filter-item').removeClass('active');
      $('.filter-star').removeClass('active');
      $('#fundType .filter-item').eq(0).addClass('active');
      $('#riskDeg .filter-item').eq(0).addClass('active');
      $('#fundStatus .filter-item').eq(0).addClass('active');
      $('#fundComCode .filter-item').eq(0).addClass('active');
      
      $('.result .filter-block').html('');
      
      loadBasicInfo();
    });
  }
  
  function btnCloseItem() {
    $(document).on('click', '.filter-factor', function () {
      var dataFilter = $(this).find('i').attr('data-filter').trim();
      $('#' + dataFilter + ' li').removeClass('active');
      if (dataFilter !== 'fundRate') {
        $('#' + dataFilter + ' li').eq(0).addClass('active');
      }
      $(this).remove();
      loadBasicInfo();
    });
  }
  
  function loadBasicInfoFilter() {
    var selector = '.filter-item,.filter-star';
    $(document).on('click', selector, function () {
      if (!$(this).hasClass('active')) {
        pageCode = 0;
        if ($(this).hasClass('filter-item')) {
          $(this).parent().find('.filter-item').removeClass('active');
          $(this).addClass('active');
        } else if ($(this).hasClass('filter-star')) {
          if ($(this).hasClass('active')
              && $('.filter-star.active').length === $(this).index() + 1) {
            $('.filter-star').removeClass('active');
          } else {
            $('.filter-star').removeClass('active');
            $('.filter-star:lt(' + ($(this).index() + 1) + ')').addClass('active');
          }
        }
        loadBasicInfo();
      }
    });
  }
  
  function loadBasicInfoSort() {
    $(document).on('click', '.sort-item', function () {
      if (!$(this).hasClass('active')) {
        pageCode = 0;
        $('.sort-item').not(this).removeClass('active');
        $(this).addClass('active');
        loadBasicInfo();
      }
    });
  }
  
  function pagination() {
    $(document).on('click', '.page-btn', function () {
      if (!$(this).hasClass('disable')) {
        var text = $(this).text().trim();
        if ('首页' === text) {
          pageCode = 0;
          $('.page-btn.home').addClass('disable');
        } else if ('下一页' === text) {
          pageCode++;
          $('.page-btn.next').addClass('disable');
        } else if ('上一页' === text) {
          pageCode--;
          pageCode = pageCode <= 0 ? 0 : pageCode;
          if (pageCode <= 0) $('.page-btn.prev').addClass('disable');
        }
        loadBasicInfo();
      }
    });
  }
  
  function getParams() {
    var FILTERS = [];
    var templateHtml = '';
    params['startIndex'] = (pageCode * pageSize) + 1;
    params['fundType'] = $('#fundType .active').index() + '';
    params['riskDeg'] = $('#riskDeg .active').index() + '';
    params['fundStatus'] = $('#fundStatus .active').index() + '';
    params['fundRate'] = $('#fundRate .active').length + '';
    params['fundComCode'] = $('#fundComCode .active').attr('data-companyCode') || '0';
    params['orderRule'] = $('.sort-item.active').attr('data-sort') || '0';
    
    for (var key in params) {
      if ($('#' + key + ' .active')[0]) {
        if (key !== 'fundRate') {
          if ($('#' + key + ' .active').index() !== 0) {
            FILTERS.push({
              label: key,
              value: $('#' + key + ' .active').text().trim()
            });
          }
        } else {
          if ($('#' + key + ' .active')[0]) {
            var tempValue = '';
            var len = $('#' + key + ' .active').length;
            switch (len) {
              case 1:
                tempValue = '一星';
                break;
              case 2:
                tempValue = '二星';
                break;
              case 3:
                tempValue = '三星';
                break;
              case 4:
                tempValue = '四星';
                break;
              case 5:
                tempValue = '五星';
                break;
            }
            FILTERS.push({
              label: key,
              value: tempValue
            });
          }
        }
      }
    }
    
    for (var i = 0; i < FILTERS.length; i++) {
      templateHtml += '<li class="filter-factor">'
          + FILTERS[i]['value'] + '<i data-filter="'
          + FILTERS[i]['label'] + '">×</i></li>';
    }
    
    $('.result .filter-block').html(templateHtml);
    
    return params;
  }
  
  //  获取基金搜索列表数据并填充
  function loadFundSearch(key) {
    return $.ajax({
      url: common.getApiUrl('searchFund', {
        searchStr: key,
        itemCount: '5'
      }),
      $renderContainer: $('#searchList ul'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-searchList', data);
        this.$renderContainer.html(htmlStr);
      }
    });
  }
  
  //  注册搜索点击事件
  function addEventListerFundSearch() {
    var xhr = null;     //  用于再次点击搜索后取消上一次的请求
    var $searchInput = $('#searchInput');
    var $searchBtn = $('#searchBtn');
    var $searchList = $('#searchList');
    $searchList.hide();
    $searchBtn.on('click', function () {
      var searchStr = $searchInput.val();
      if (searchStr) {
        $searchList.show();
        xhr && xhr.abort();
        xhr = loadFundSearch(searchStr);
      }
    });
    $searchList.on('click', '.closeBtn', function () {
      $searchList.hide();
    });
  }
  
  //  获取热搜基金并填充模板
  function loadFundHotSearch() {
    $.ajax({
      url: common.getApiUrl('getFundHotSearch'),
      $renderContainer: $('#hotSearch'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-hotSearch', data);
        this.$renderContainer.html(htmlStr);
      }
    });
  }
  
  //  获取公告列表并填充模板
  function loadAnnounce() {
    $.ajax({
      url: common.getApiUrl('getAnnounce', {
        startIndex: '',
        itemCount: '',
        contentType: 'tygg'
      }),
      $renderContainer: $('#announce_content'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-announce_content', data);
        this.$renderContainer.html(htmlStr);
      }
    });
  }
  
  //  获取推荐基金列表并填充模板
  function loadFundRecommend() {
    $.ajax({
      url: common.getApiUrl('getFundRecommend', {
        startIndex: '1',
        itemCount: '3',
        fundRecommendType: 'rmtj'
      }),
      $renderContainer: $('#fundRecommend'),
      success: function (rawData) {
        var data = rawData.data;
        if (!common.ajaxDataIsExist(data)) return;
        var htmlStr = template('tpl-fundRecommend', data);
        this.$renderContainer.html(htmlStr);
      }
    });
  }
  
  function tabChangeFundList() {
    var selector = '.module-3 .tab-item';
    $(document).on('click', selector, function () {
      pageCode = 0;
      $(selector).not(this).removeClass('active');
      $(this).addClass('active');
      params['saleOrg'] = $(this).index() === 0 ? '1' : '0';
      loadBasicInfo();
    });
  }
});
