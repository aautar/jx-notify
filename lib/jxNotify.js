/*
jxNotify

Version 0.3.0
    
Copyright (c) 2016, Avishkar Autar
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.
* The name of the author may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var jxNotify = {

    /**
     * CSS styles for jxNotify DOM elements
     */
    styles: `
                .jxnotify { font-size:12px; position:fixed; bottom:13px; left:0; width:65%; margin:0 17.5% 0 17.5%; padding:0; height:24px; background-color:#000; border-radius:10px; }
                .jxnotify p { margin:0; padding:0; line-height:24px; color:#fff; font-weight:bold; text-align:center; }
                .jxnotify p span { vertical-align:middle; margin-right:0.5%; display:inline-block; height: 24px; }
            `,

    /**
     * Container DOM element 
     */
    continerElement: null,
    
    /**
     * Current DOM element for notification, null if nothing in DOM
     */
    notificationElem: null,

    /**
     * Initialize a new jxNotify context, with rendering bound within the specified container
     */
    init: function(_containerElement) {
        
        // store ref to container
        this.containerElement = _containerElement;

        // put styles onto page (if they're not already there)
        if(document.getElementById('jxNotifyStyles') === null) {
            var style = document.createElement('style');
            style.id = 'jxNotifyStyles';
            style.type = 'text/css';
            style.innerHTML = this.styles;
            document.getElementsByTagName('head')[0].appendChild(style);
        }        

        return this;
    },
    
    /**
     * Render jxNotify notification
     */
    render: function(_notificationData) {
               
        var markup = `<div class="jxnotify">
                        <p>
                            <span><img src="${_notificationData.iconURL}" alt="notify icon" /></span>${_notificationData.message}
                        </p>
                      </div>`;

        if(this.notificationElem) { // remove any existing jxNotify DOM elements
            this.containerElement.removeChild(this.notificationElem);
            this.notificationElem = null;
        }
        
        this.notificationElem = this.appendHTML(this.containerElement, markup, function(elem) {
            // hide the element when we add it to the page DOM
            elem.style.display = 'none';
        });                
        
    },

    /**
     * DOM helper method to append HTML into DOM
     */
    appendHTML: function(_parentElement, _childHTML, _beforeAppend) {
        var tempElem = document.createElement('div');
        tempElem.innerHTML = _childHTML;
        var firstChild = tempElem.firstChild;

        if(typeof _beforeAppend !== 'undefined') {
            _beforeAppend(firstChild);
        }

        _parentElement.appendChild(firstChild);

        return firstChild;
    },

    /**
     * Add a notification, overwrites any existing notification
     */
    notify: function(_notificationData, _timeout) {

        var thisJxNotifyInstance=this;
        
        this.render(_notificationData);
        this.show();
        if(_timeout) {
            setTimeout(function() {
                thisJxNotifyInstance.hide();
            }, _timeout);
        }
    },

    /**
     * Show notification
     */
    show: function() {
        this.notificationElem.style.display = 'block';
        this.notificationElem.style.opacity = 0;
        this.notificationElem.style.transition = 'opacity 1.15s';

        // trigger reflow
        this.notificationElem.offsetWidth;

        this.notificationElem.style.opacity = 1;
    },

    /**
     * Hide notification
     */
    hide: function() {

        var notificationElem = this.notificationElem;

        notificationElem.style.transition = 'opacity 1.15s';
        notificationElem.style.opacity = 0;

        var afterHide = function() {
            notificationElem.style.display = 'none';
            notificationElem.removeEventListener("transitionend", afterHide);
        };

        notificationElem.addEventListener("transitionend", afterHide, false);
    }

};
