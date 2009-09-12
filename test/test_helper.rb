require 'test/unit'

require 'rubygems'
require 'shoulda'
require 'rack/test'

ENV['RACK_ENV'] = 'test' # AKK: Wish there was a better way to do this

require 'tag_better'
require 'app'

