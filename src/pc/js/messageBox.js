define(['jquery', 'bootstrap'], function ($) {
    /**
     *
     * @constructor
     */
    function MessageBox() {
        var arguments = arguments.length ? arguments[0] : arguments;
        this.iSwitch = arguments['iSwitch'] ? arguments['iSwitch'] : true;
        this.element = arguments['element'] ? arguments['element'] : '#msgModal';
        this.backDrop = arguments['backDrop'] ? arguments['backDrop'] : '.modal-backdrop';
        this.btnConfirm = arguments['btnConfirm'] ? arguments['btnConfirm'] : this.element + ' .btn.confirm';

        this.Icons = {
            ERROR: "error_icon.png",
            WARNING: "warn_icon.png",
            QUESTION: "question_icon.png",
            INFORMATION: "info_icon.png"
        };

        this.Buttons = {
            OK: '<button class="btn btn-primary confirm" data-dismiss="modal">确认</button>',
            CANCEL: '<button class="btn btn-default cancel" data-dismiss="modal">取消</button>',
            OK_CANCEL: '<button class="btn btn-primary confirm" data-dismiss="modal">确认</button>'
            + '<button class="btn btn-default cancel" data-dismiss="modal">取消</button>'
        };
    }

    /**
     *
     * @param title
     * @param message
     * @param MessageBoxButtons
     * @param MessageBoxIcons
     * @returns {MessageBox}
     */
    MessageBox.prototype.show = function (title, message, MessageBoxButtons, MessageBoxIcons) {
        $(this.element).remove();
        $(this.backDrop).remove();
        var className = MessageBoxIcons.substring(0, MessageBoxIcons.length - 9);
        var TEMP_HTML = '<div class="modal fade" id="msgModal">'
            + '<div class="modal-dialog"><div class="modal-content ' + className + '"><div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '<h4 class="modal-title">' + title + '</h4></div><div class="modal-body"><div class="modal-info row">'
            + '<div class="modal-column col-xs-2"><img src="../images/' + MessageBoxIcons + '"/></div><div class="modal-column col-xs-10">'
            + '<p class="modal-text">' + message + '</p></div></div></div><div class="modal-footer">' + MessageBoxButtons + '</div></div></div></div>';

        $('body').prepend(TEMP_HTML);
        $(this.element).modal('toggle');
        return this;
    };
    /**
     *
     * @param fn
     * @returns {MessageBox}
     */
    MessageBox.prototype.confirm = function (fn) {
        $(this.btnConfirm).on("click", function () {
            if ('function' === typeof fn) fn();
        });
        return this;
    };

    return new MessageBox();

});
