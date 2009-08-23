require 'sinatra'

class TagBetter::App < Sinatra::Base
  
  configure do
    TagBetter.init
  end
  
  get '/:user/bundles', :provides => 'application/json' do
    TagBetter::Bundle.for(params[:user], params[:password]).to_json
  end
  
  get '/test' do
    'OK.'
  end
  
end
