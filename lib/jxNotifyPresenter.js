var jxNotifyPresenter = {

    /**
     * @type DOMElement
     */
    notificationElem: null,

    /**
     *
     * @param _notificationElem
     */
    init: function(_notificationElem) {
        this.notificationElem = _notificationElem;
    },

    /**
     * Trigger reflow
     */
    _triggerReflow: function() {
        // trigger reflow
        this.notificationElem.offsetWidth;
    },

    /**
     * Show notification
     */
    show: function() {

        var elem = this.notificationElem;
        if(elem === null) {
            return false;
        }

        elem.style.display = 'block';
        elem.style.opacity = 0;
        elem.style.transform = "translate3d(0,10px,0)";
        elem.style.transition = 'transform 0.25s, opacity 0.25s';

        this._triggerReflow();

        elem.style.opacity = 1;
        elem.style.transform = "translate3d(0,0,0)";

        return true;
    },

    /**
     * Hide notification
     * @param _onHideFinish
     */
    hide: function(_onHideFinish) {

        var elem = this.notificationElem;
        if(elem === null) {
            return false;
        }

        elem.style.transition = 'transform 0.25s, opacity 0.25s';
        elem.style.opacity = 0;
        elem.style.transform = "translate3d(0,10px,0)";

        var afterHide = function() {
            elem.style.display = 'none';
            elem.removeEventListener("transitionend", afterHide);

            if(_onHideFinish) {
                _onHideFinish();
            }
        };

        elem.addEventListener("transitionend", afterHide, false);

        return true;
    }
};
