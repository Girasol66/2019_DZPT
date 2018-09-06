define(['jquery'], function ($) {
    var COM_NODE = '<div class="common__ajaxBox__wrapper"></div>';
    var LOAD_NODE = '<div class="spinner">'
        + '<div class="spinner-container container1">'
        + '<div class="circle1"></div>'
        + '<div class="circle2"></div>'
        + '<div class="circle3"></div>'
        + '<div class="circle4"></div></div>'
        + '<div class="spinner-container container2">'
        + '<div class="circle1"></div>'
        + '<div class="circle2"></div>'
        + '<div class="circle3"></div>'
        + '<div class="circle4"></div></div>'
        + '<div class="spinner-container container3">'
        + '<div class="circle1"></div>'
        + '<div class="circle2"></div>'
        + '<div class="circle3"></div>'
        + '<div class="circle4"></div></div></div>';

    $.ajaxSetup({
        $renderContainer: '{}',
        $comNode: $(COM_NODE),
        $loadNode: $(LOAD_NODE),
        beforeSend: function () {
            this.$comNode.html(this.$loadNode);
            this.$renderContainer.append(this.$comNode);
        }
    });
});
