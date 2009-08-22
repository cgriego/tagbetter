load('deploy')

set :application, "tagbetter"
set :domain,      "tagbetter.r09.railsrumble.com"
set :repository,  'git@github.com:railsrumble/rr09-team-208.git'
set :use_sudo,    false
set :deploy_to,   "/apps/#{application}"
set :scm,         "git"
set :user,        'deploy'

role :app, domain
# role :web, domain
# role :db,  domain, :primary => true

namespace :deploy do
  
  task :start, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end

  task :stop, :roles => :app do
    # Do nothing.
  end

  desc "Restart Application"
  task :restart, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end
  
  desc "Update the Apache vhost config"
  task :update_vhost, :roles => :app do
    puts "WRITE ME"
  end
  
end
