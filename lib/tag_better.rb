require 'couchrest'
require 'json'
require 'restclient'

module TagBetter
  
  def self.setup_database
    Bookmark.use_database(database)
  end
  
  def self.database
    CouchRest::Database.new(server, 'tagbetter')
  end
  
  def self.server
    CouchRest::Server.new
  end
  
end

require 'tag_better/core_ext'
require 'tag_better/delicious_feed'
require 'tag_better/bookmark'
