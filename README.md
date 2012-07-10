# Throttle v0.1.0 #

Throttle is a simple node.js app that makes it easier to test how a website performs on poor network connections. For example, testing a responsive website on a poor 3G connection without actually having to have a poor 3G connection. Simply connect your Mac to ethernet, share the network connection via Airport, run Throttle, and any connected device will then be throttled to the the network speed you specified. Throttle was designed to be used in conjunction with a device lab and products like [Adobe Shadow](http://labs.adobe.com/technologies/shadow/) where a shared connection is expected.

## Features ##

Throttle has some very simple features:

* Web-based app so it can be accessed by anyone on your local network
* Modify download network speeds for connected devices
* Modify upload network speeds for connected devices
* Modify the latency, or delay, in the network connection for connected devices
* Use presets to quickly switch between network types
* The machine Throttle is installed on and devices connect through still has a full-speed Internet connection

## Screenshot ##

You can [see what you'll be getting](http://dmolsen.com/throttle-screen.png) if you install Throttle.

## Requirements ##

Throttle requires a Mac that is connected to the Internet via ethernet and that also has WiFi capabilities. Throttle has been tested on Mac OS X 10.6.8 & 10.7.4. I highly encourage you to stay away from 32-bit-only Macs as your Throttle platform.

## Installing Throttle ##

Installing Throttle requires modifying several different parts of your Mac.

### Make Sure ipfw Can Run Without a Password ###

Throttle is simply a web-based wrapper for [ipfw](http://www.freebsd.org/doc/en_US.ISO8859-1/books/handbook/firewalls-ipfw.html). Unfortunately, ipfw requires `sudo` to run and, therefore, will prompt for a password when the command is run. This doesn't work well for a web-based product. To make sure Throttle and ipfw can run without a password do:

1. At command prompt type: `sudo visudo`
2. Enter in your administrator password
3. Using the arrow key scroll to the bottom, type `i`, hit a carriage return so you have a new line and then type: `[your username] ALL= NOPASSWD: /sbin/ipfw`
4. Hit `ESC` and then `:wq`

### Install Node ###

Install node from http://nodejs.org/. They have a handy Mac OS X installer

### Download & Configure Throttle ###

Run the following commands from the command line:

1. `git clone git://github.com/dmolsen/Throttle.git`
2. `cd Throttle`
3. `npm install express`
4. `npm install jade`
5. `node app.js`

You should now have Throttle running on port 3000. If the `node` command was unrecognized try `/usr/local/bin/node app.js` for step #5

### Turn on Internet Sharing ###

Turn on Internet Sharing so your mobile devices can connect to your Mac as a WiFi access point:

1. Open Settings > Sharing
2. Select the 'Internet Sharing' option
3. Select 'Ethernet' from the 'Share your connection from:' dropdown
4. Mark the checkbox next to Airport
5. Mark the checkbox next to 'Internet Sharing' & confirm you want to run it

Any device that uses that WiFi access point will now be throttled based on the options you choose when you configure network performance via Throttle's admin.

## Connecting to Throttle to Change Bandwidth & Latency ##

The easiest way to connect to Throttle from multiple desktops (e.g. designers and developers want to log on from personal machines) is by using [xip.io](http://xip.io/). To do so:

1. Open Settings > Network
2. Note the IP address that's listed (will be something like 10.0.x.x or 192.168.x.x)
3. In the address bar of your browser type: `http://10.0.x.x.xip.io:3000` where `10.0.x.x` is replaced with the IP address from step #2

You should now see the Throttle admin page. As long as any designers or developers connect to the new WiFi access point they should be able to enter in the xip.io address and change the settings.

## Using Adobe Shadow with Throttle ##

To use Adobe Shadow with Throttle simply make sure all of your devices and your desktop machine are connected to the WiFi point from the Mac Throttle is running on. Note that any latency or other options (but especially latency) will affect the speed of Adobe Shadow. I'll need to look into that.

## Credits ##

Throttle started as a hack to [shim](https://github.com/marstall/shim/) so thanks to that project and the team at Boston Globe for the inspiration. Throttle uses [Twitter Bootstrap](http://twitter.github.com/bootstrap/) and [Glyphicons](http://glyphicons.com/) for design elements.