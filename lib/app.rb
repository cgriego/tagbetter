require 'sinatra'

class TagBetter < Sinatra::Default
  
  helpers do
    def json(body)
      content_type('application/json')
      body
    end
  end
  
  get '/:user/recent' do
    json ['Nothing here yet.']
  end
  
end
