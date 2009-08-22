load('deploy')

set :application, "tagbetter"
set :domain,      "tagbetter.r09.railsrumble.com"
set :repository,  'git@github.com:railsrumble/rr09-team-208.git'
set :use_sudo,    false
set :deploy_to,   "/apps/#{application}"
set :scm,         "git"
set :user,        'deploy'

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
  
  desc "Update the Apache virtual host for the application"
  task :update_vhost, :roles => :app do
    sudo "cp #{current_release}/config/tagbetter.conf /etc/apache2/sites-available/tagbetter.conf"
    sudo 'apachectl graceful'
  end
  
end
