$LOAD_PATH << File.join(File.dirname(__FILE__), 'lib')

require 'tag_better'
require 'app'

run TagBetter::App
