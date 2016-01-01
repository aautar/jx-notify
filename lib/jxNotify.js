/*
jxNotify

Version 0.3.0
    
Copyright (c) 2011, Avishkar Autar
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

    markup: `<div style="font-size:12px; position:fixed; bottom:13px; left:0; width:65%; margin:0 17.5% 0 17.5%; padding:0; height:24px; background-color:#000; border-radius:10px;">
                <p style="margin:0; padding:0; line-height:24px; color:#fff; font-weight:bold; text-align:center;">
                    <img style="vertical-align:middle; margin-right:0.5%" src="{{ iconURL }}" alt="notify icon" />{{ message }}
                </p>
            </div>`,

    continerElement: null,
    notificationElem: null,
    templateVarToDOMObject: new Map(),

    init: function(_containerElement) {

        var self = this;

        this.containerElement = _containerElement;
        this.notificationElem = this.appendHTML(this.containerElement, this.markup, function(elem) {
            // hide the element when we add it to the page DOM
            elem.style.display = 'none';
            self.findTemplatedElements(elem);
        });

        return this;
    },

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



    getTemplateVarMatches: function(_str) {
        return _str.match(new RegExp("\\{\\{\\s*.*\\s*\\}\\}", "g"));
    },

    stripBracesFromTemplateVar: function(_var) {
        var output = _var;
        output = output.replace(/\{/g, '');
        output = output.replace(/\}/g, '');
        output = output.trim();
        return output;
    },

    findTemplatedElements: function(_topLevelElement) {

        var allChildNodes = _topLevelElement.childNodes;
        for(var i=0; i<allChildNodes.length; i++) {
            var node = allChildNodes[i];
            if(node.nodeType === Node.TEXT_NODE) {

                var matches = this.getTemplateVarMatches(node.textContent);
                if(matches !== null) {
                    var key = this.stripBracesFromTemplateVar(matches[0]);
                    this.templateVarToDOMObject.set(key, node);
                }
            }

            if(node.nodeType === Node.ELEMENT_NODE) {

                var attribs = node.attributes;
                for(var j=0; j<attribs.length; j++) {
                    var matches = this.getTemplateVarMatches(attribs[j].value);
                    if(matches !== null) {
                        var key = this.stripBracesFromTemplateVar(matches[0]);
                        this.templateVarToDOMObject.set(key, attribs[j]);
                    }
                }

                this.findTemplatedElements(node);
            }
        }
    },

    notify: function(_notificationData, _timeout) {

        var self=this;

        for(var field in _notificationData) {
            var domObj = this.templateVarToDOMObject.get(field);

            if(domObj && domObj.nodeType == Node.TEXT_NODE) {
                domObj.textContent = _notificationData[field];
            }

            if(domObj && domObj.value) {
                domObj.value = _notificationData[field];
            }
        }

        self.show();

        if(_timeout) {
            setTimeout(function() {
                self.hide();
            }, _timeout);
        }
    },

    show: function() {
        this.notificationElem.style.display = 'block';
        this.notificationElem.style.opacity = 0;
        this.notificationElem.style.transition = 'opacity 1.15s';

        // trigger reflow
        this.notificationElem.offsetWidth;

        this.notificationElem.style.opacity = 1;
    },

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
