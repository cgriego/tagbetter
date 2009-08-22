require 'sinatra'

class TagBetter::App < Sinatra::Base
  
  configure do
    TagBetter.setup_database
  end
  
  helpers do
    def json(body)
      content_type('application/json')
      body
    end
  end
  
  get '/:user/recent' do
    json ['Nothing here yet.']
  end
  
  get '/test' do
    'OK.'
  end
  
end
