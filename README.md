#jxNotify

Simple JS notification component

![jxNotify](http://semisignal.com/uploaded_images/jx-notify.gif)

##Usage

```js
// Create notifier object and initialize with container DOM element
var notifier = Object.create(jxNotify);
notifier.init( document.getElementsByTagName('body')[0] ); 

// Create message JSON object and call notify (id and message are required)
notifier.notify(
  {
    id:"fail_connect",
    message: "Failed to connect to server!",
    iconURL: "dotspott-logo.svg",
    backgroundColor: "error",
    timeout: 2000
  }
);

```
