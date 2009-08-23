require 'sinatra'

class TagBetter::App < Sinatra::Base
  
  enable :sessions
  
  configure do
    TagBetter.init
  end
  
  helpers do
    
    def setup_session(username, password)
      session[:username] = username
      session[:password] = password
      
      TagBetter.logger.info "Logged in #{username} with #{userhash}"
    end
    
    def userhash
      @userhash ||= TagBetter.userhash(session[:username], session[:password])
    end
    
  end
  
  post '/login' do
    setup_session(params[:username], params[:password])
    redirect '/tagbetter.html'
  end
  
  get '/:username/bundles', :provides => 'application/json' do
    TagBetter::Bundle.for(params[:username], session[:password]).to_json
  end
  
  get '/:username/tags', :provides => 'application/json' do
    TagBetter::Tag.for(params[:username], session[:password]).to_json
  end
  
  get '/:username/tags/search', :provides => 'application/json' do
    TagBetter::Tag.search(userhash, params[:q]).to_json
  end
  
end
