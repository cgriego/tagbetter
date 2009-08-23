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
  
  post '/forget' do
    session.clear
    redirect '/login'
  end
  
  get '/bundles', :provides => 'application/json' do
    {:bundles => TagBetter::Bundle.for(session[:username], session[:password])}.to_json
  end
  
  post '/bundles' do
    bundle = JSON.load(request.body)
    if TagBetter::Delicious.update_bundle(bundle, 
         session[:username], 
         session[:password])
      status 202
    else
      status 400
    end
  end
  
  get '/tags', :provides => 'application/json' do
    tags = TagBetter::Tag.for(session[:username], session[:password])
    tags = tags.sort_by { |t| t.name.downcase }
    {:tags => tags}.to_json
  end
  
  get '/tags/search', :provides => 'application/json' do
    {:results => TagBetter::Tag.search(userhash, params[:q])}.to_json
  end
  
  post '/purge' do
    TagBetter.purge(userhash)
    status 204
  end
  
end
