/*
jxNotify
version 0.2
    
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

/*

v0.2
+ img markup for icon only added to DOM if icon argument specified in jxNotify.init() call
+ -webkit-border-radius, -moz-border-radius added for border radius on older webkit and gecko browser engines
+ jxNotify.width, jxNotify.margin, jxNotify.left variables now accessible for overriding default css values

*/


var jxNotify = {
    
    width: '65%',
    margin: '0 17.5% 0 17.5%',
    left: '0',
    markup: `<div id="{{ id }}" style="display:none; font-size:12px; position:fixed; bottom:13px; left:{{ position.left }}px; width:{{ size.width }}px; margin:{{ margins }}; padding:0; height:24px; background-color:#000; border-radius:10px;">
                <p style="margin:0; padding:0; line-height:24px; color:#fff; font-weight:bold; text-align:center;">
                    <img style="vertical-align:middle;" src="{{ iconUrl }}" alt="notify icon" />
                </p>
             </div>
            `,

    create: function(_containerElement, _notificationData) {
        $(_containerElement).append(this.markup);
    },

    clear: function() {
        $('#__jx_notify_overlay').fadeOut('slow');
    }

};



jxNotify.notifyPostError = function (msg) {
    $('#__jx_notify_overlay').fadeOut('slow', function () {
        $('#__jx_notify_overlay').css('background-color', '#780000');
        $('#__jx_notify_overlay #__jx_notify_overlay_txt').html(msg);
        $('#__jx_notify_overlay').hide().fadeTo('fast', 1.0, function () {

        });
    });
}

jxNotify.notifyPost = function (msg)
{
    $('#__jx_notify_overlay').fadeOut('slow', function ()
    {
        $('#__jx_notify_overlay').css('background-color', '#000');
        $('#__jx_notify_overlay #__jx_notify_overlay_txt').html(msg);
        $('#__jx_notify_overlay').hide().fadeTo('fast', 1.0, function ()
        {
            setTimeout(function () { $('#__jx_notify_overlay').fadeOut('slow'); }, 5000);
        });

    });
}

jxNotify.notifyPre = function (msg)
{
    $('#__jx_notify_overlay').css('background-color', '#000');
    $('#__jx_notify_overlay #__jx_notify_overlay_txt').html(msg);
    $('#__jx_notify_overlay').fadeIn(0, 0.5);
}
