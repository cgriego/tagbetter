require 'sinatra'

class TagBetter::App < Sinatra::Base
  
  enable :sessions
  
  configure do
    TagBetter.init
  end
  
  post '/login' do
    session[:username] = params[:username]
    session[:password] = params[:password]
    redirect '/tagbetter.html'
  end
  
  get '/:username/bundles', :provides => 'application/json' do
    TagBetter::Bundle.for(params[:username], session[:password]).to_json
  end
  
end
