require 'logger'

require 'couchrest'
require 'json'
require 'nokogiri'
require 'restclient'

module TagBetter
  
  def self.database
    CouchRest::Database.new(server, 'tagbetter')
  end
  
  def self.server
    CouchRest::Server.new
  end
  
  def self.userhash(username, password)
    Digest::SHA1.hexdigest("#{username + password}")
  end
  
  def self.logger
    @@logger ||= returning Logger.new('log/tagbetter.log') do |logger|
      logger.level = Logger::DEBUG
    end
  end
  
  def self.purge(userhash)
    docs = [Bundle.by_userhash(:key => userhash),   
            Tag.by_userhash(:key => userhash)].flatten
    docs.each { |d| d.destroy }
    # AKK: some day, bulk save (bug in couchrest?)
    # database.bulk_delete
    
    logger.info("Purged #{userhash}")
  end
  
end

require 'tag_better/core_ext'
require 'tag_better/delicious'
require 'tag_better/bookmark'
require 'tag_better/bundle'
require 'tag_better/tag'

module TagBetter
  
  MODELS = [TagBetter::Bookmark,
            TagBetter::Bundle,
            TagBetter::Tag]
  def self.setup_database
    MODELS.each { |m| m.use_database(database) }
  end
  
  def self.update_design_docs
    MODELS.each { |m| m.refresh_design_doc }
  end
  
  def self.init
    setup_database
    update_design_docs
  end
  
end
