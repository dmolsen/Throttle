# Throttle v0.1.0 #

Throttle is a simple node.js app that makes it easier to test how a website performs on poor network connections. For example, testing a responsive website on a poor 3G connection without actually having to have a poor 3G connection. Simply connect your Mac to ethernet, share the network connection via Airport, run Throttle, and any connected device will then
be throttled to the the network speed you specified. Throttle was designed to be used in conjunction with a device lab and products like [shim](https://github.com/marstall/shim/) or [Adobe Shadow](http://labs.adobe.com/technologies/shadow/) where a shared connection is expected.

## Features ##

Throttle has some very simple features:

* Web-based app so it can be accessed by anyone on your local network
* Modify download network speeds for connected devices
* Modify upload network speeds for connected devices
* Modify the latency, or delay, in the network connection for connected devices
* Use presets to quickly switch between network types

## Requirements ##

Throttle has only been used on a Mac running 10.6.8. It should work on 10.7 with no problems. The Mac must have ethernet and WiFi connections.

## Installing Throttle ##

Coming soon ;) I want to reinstall it before filling this part out.

## Credits ##

Throttle started as a hack to [shim](https://github.com/marstall/shim/) so thanks to that project and the team at Boston Globe for the inspiration. Throttle uses [Twitter Bootstrap](http://twitter.github.com/bootstrap/) and [Glyphicons](http://glyphicons.com/) for design elements.