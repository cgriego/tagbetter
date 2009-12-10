require 'rake/testtask'

task :default => [:test]

Rake::TestTask.new do |t|
  t.libs << 'test'
  t.test_files = FileList['test/*_test.rb']
end

namespace :tagbetter do
  
  desc "Install gem dependencies"
  task :gems do
    gem_deps = %w{couchrest json rest-client sinatra nokogiri}
    sh "gem install --no-ri --no-rdoc #{gem_deps.join(' ')}"
  end
  
end

begin
  
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
rescue LoadError => e
  puts "Missing dependencies. `rake tagbetter:gems` to install them."
end
