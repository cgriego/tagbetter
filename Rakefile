$LOAD_PATH << File.join(File.dirname(__FILE__), 'lib')
require 'tag_better'

namespace :couchdb do
  
  desc "Create the database"
  task :create do
    TagBetter.server.create_db('tagbetter')
  end
  
  desc "Drop the database"
  task :drop do
    if ENV['SRSLY']
      TagBetter.database.delete!
    else
      puts "Do you SRSLY want to drop the database?"
    end
  end
  
end
