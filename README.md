ANSI Viewer
===========

A Firefox addon which let you view .ans file in the browser.

Features
--------

* Support big5-uao by using [uao-js](https://github.com/eight04/uao-js).
* Support ANSI color by using [bbs-reader](https://github.com/eight04/bbs-reader).
* Support pmore animation by using [pmore-js](https://github.com/eight04/pmore-js).
* Invert color with Alt+L. (use CSS filter)
* Blinking text.

Screenshots
-----------

### With cleartype

![screenshot](http://i.imgur.com/FS5ch99.png)

### Without cleartype

![screenshot](http://i.imgur.com/s1uUlLH.png)

Changelog
---------

* 1.4.0 (Sep 27, 2016)

	- Support multiprocess.
	- Fix charset problem when using context menu to convert text file.

* 1.3.0 (Sep 21, 2016)

	- Update bbs-reader to 0.3.0. Some style changed.
	- Add context menu "View as ANSI", which let you view any text file (text/plain) in ANSI mode. ([#2](https://github.com/eight04/ansi-viewer/issues/2))

* 1.2.3 (Sep 6, 2016)

	- Update bbs-reader to 0.2.4. Fix w > 80 bug.
	- Fix: right border disappears when horizontal scrollbar exists.

* 1.2.2 (Jul 19, 2016)

	- Update bbs-reader to 0.2.3. Fix ANSI color bug and HTML entity bug.

* 1.2.1 (Jun 24 2016)

	- Update bbs-reader to 0.2.2. Fix a bug with consequent escape code.

* 1.2.0 (Apr 30, 2016)

	- Update bbs-reader to 0.2.1.
	- Remove 80 characters width limit.
	- Use CSS animation for blinking text.

* 1.1.0 (Apr 30, 2016)

	- Move to bbs-reader.
	- Work with pmore-js!
	- Drop mousetrap

* 1.0.0 (Apr 28, 2016)

	- Move to uao-js.
	- License change to MIT.

* 0.1.1 (Apr 26, 2016)
    
    - Fix license.
    - Fix color overflow bug.
    - Add color for replies. (`: `)
    
* 0.1.0 (Apr 25, 2016)

    - First release.
