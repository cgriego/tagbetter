# Tag Better

Tag Better is an enhancement over Delicious. We're just trying to make it a little more pleasant to use.

## Getting started

* Install Passenger
  
  1. Install the Passenger gem: `$ sudo gem install passenger`
  2. Build the Apache module: `passenger-install-apache2-module`
  3. Add the extra bit to your httpd.conf as specified by Passenger
  4. Install the Passenger Preference Pane: http://www.fngtps.com/passenger-preference-pane

* Install CouchDBX

  1. Download from http://janl.github.com/couchdbx/
  2. Drag into your apps folder
  3. Start it up

* Install Nokogiri (for parsing XML)

  1. Update libxml and friends: `sudo port install libxml2 libxslt`
  2. Install nokogiri: `sudo gem install nokogiri -- --with-xml2-include=/opt/local/include/libxml2 --with-xml2-lib=/opt/local/lib --with-xslt-dir=/opt/local`
* Install dependencies
* Run the application

## Hacking

* Assets are served out of public. Anything within that directory is served from the root of the web app.
* If you need to modify the application code, you'll want to touch `tmp/always_restart.txt`. This tells Passenger to restart the application on every request. You may notice a slight performance hit in doing so.
