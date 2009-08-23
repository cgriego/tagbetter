load('deploy')

set :application, "tagbetter"
set :domain,      "tagbetter.r09.railsrumble.com"
set :repository,  'git@github.com:railsrumble/rr09-team-208.git'
set :use_sudo,    false
set :deploy_to,   "/apps/#{application}"
set :scm,         "git"
set :user,        'deploy'
set :branch,      'railsrumble09'

role :app, domain

namespace :deploy do
  
  task :start, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end

  task :stop, :roles => :app do
    # Do nothing.
  end

  desc "Restart application"
  task :restart, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end
  
end

namespace :tagbetter do
  
  desc "Update the Apache virtual host for the application"
  task :update_vhost, :roles => :app do
    sudo "cp #{current_release}/config/tagbetter.conf /etc/apache2/sites-available/tagbetter"
    sudo '/etc/init.d/apache2 reload'
  end
  
  desc "Install gem dependencies"
  task :gems, :roles => :app do
    run "cd #{current_release} && rake tagbetter:gems"
  end
  
  desc "Create the CouchDB application database"
  task :create_db, :roles => :app do
    run "cd #{current_release} && rake couchdb:create"
  end
  
end
