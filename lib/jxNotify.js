var jxNotify = {

    /**
     * CSS styles for jxNotify DOM elements
     */
    styles: 
            (
                '.jxnotify { font-size:14px; position:fixed; bottom:13px; left:0; width:65%; margin:0 17.5% 0 17.5%; padding:0; height:24px; background-color:#000; border-radius:10px; }' +
                '.jxnotify p { margin:0; padding:0; color:#fff; text-align:center; line-height:24px; }' +
                '.jxnotify p span { vertical-align:top; margin-right:0.5%; display:inline-block; }' +
                '.jxnotify p span img { width:23px; }' +
                '.jxnotify.bg-color-error { background:#780000; }'
            ),

    /**
     * Container DOM element 
     */
    containerElement: null,
    
    /**
     * Current DOM element for notification, null if nothing in DOM
     */
    notificationElem: null,

    /**
     * Showing notification?
     * @type Boolean
     */
    isShowingNotification: false,

    /**
     * @type int
     */
    currentNotificationId: null,

    /**
     * @type jxNotifyPresenter
     */
    presenter: null,

    /**
     * Initialize a new jxNotify context, with rendering bound within the specified container
     */
    init: function(_containerElement, _presenter) {
        
        this.containerElement = _containerElement;
        this._setupStyles();

        var markup = '<div class="jxnotify"></div>';
        this.notificationElem = this._appendHTML(this.containerElement, markup, function(elem) {
            // hide the element when we add it to the page DOM
            elem.style.display = 'none';
        });

        if(_presenter) {
            this.presenter = _presenter;
        } else {
            this.presenter = Object.create(jxNotifyPresenter);
            this.presenter.init(this.notificationElem);
        }
        
        return this;
    },
    
    /**
     * Setup a <style> block with the jxNotify CSS styles
     */
    _setupStyles: function() {        
        // put styles onto page (if they're not already there)
        if(document.getElementById('jxNotifyStyles') === null) {
            var style = document.createElement('style');
            style.id = 'jxNotifyStyles';
            style.type = 'text/css';
            style.innerHTML = this.styles;
            document.getElementsByTagName('head')[0].appendChild(style);
        }                
    },
    
    /**
     * Render jxNotify notification
     * @param _notificationData
     */
    _render: function(_notificationData) {
               
        var bgColorClass = '';
        if(_notificationData.backgroundColor) {
            bgColorClass = 'bg-color-' + _notificationData.backgroundColor;
            this.notificationElem.classList.add(bgColorClass);
        } else {
            this.notificationElem.classList.remove("bg-color-error");
        }
        
        var iconMarkup = '';
        if(_notificationData.iconURL) {
            iconMarkup = '<span><img src="' + _notificationData.iconURL + '" alt="notify icon" /></span>';
        }
               
        var markup = '<p>' + iconMarkup + ' ' + _notificationData.message + '</p>';
        this.notificationElem.innerHTML = markup;
    },

    /**
     * DOM helper method to append HTML into DOM
     * @param _parentElement
     * @param _childHTML
     * @param _beforeAppend
     */
    _appendHTML: function(_parentElement, _childHTML, _beforeAppend) {
        var tempElem = document.createElement('div');
        tempElem.innerHTML = _childHTML;
        var firstChild = tempElem.firstChild;

        if(typeof _beforeAppend !== 'undefined') {
            _beforeAppend(firstChild);
        }

        _parentElement.appendChild(firstChild);

        return firstChild;
    },

    _checkSurfaceNextNotification: function() {
        var data = this.pop();
        if(data) {
            this._notify(data);
        }
    },

    /**
     * Add a notification, overwrites any existing notification
     * @param _notificationData object {id, message, timeout}
     * @returns {undefined}
     */
    notify: function(_notificationData) {

        var thisJxNotifyInstance=this;

        if(thisJxNotifyInstance.currentNotificationId === _notificationData.id) {
            return false;
        }

        if(thisJxNotifyInstance.isShowingNotification) {
            thisJxNotifyInstance.clear(function() {
                thisJxNotifyInstance.notify(_notificationData);
            });           
            return true;
        }

        var timeout = -1;
        if(_notificationData.timeout) {
            timeout = _notificationData.timeout;
        }
        
        this._render(_notificationData);
        this.presenter.show();
        this.isShowingNotification = true;
        this.currentNotificationId = _notificationData.id;

        if(timeout !== -1) {
            setTimeout(function() {
                thisJxNotifyInstance.clear(); // clear notification
            }, timeout);
        }

        return true;
    },

    clear: function(_onClearFinish) {
        if(this.isShowingNotification) {
            this.isShowingNotification = false;
            this.currentNotificationId = null;
            this.presenter.hide(_onClearFinish);
        }
    }
};
