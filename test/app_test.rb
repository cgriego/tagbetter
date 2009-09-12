require 'test_helper'

class AppTest < Test::Unit::TestCase
  include Rack::Test::Methods
  
  context 'Application' do
    
    context 'login' do
      
      should 'set username and password in the session' do
        username, password = 'bob', 'bob'
        
        post '/login', :username => username, :password => 'password'
        assert last_request.env['rack.session'].has_key?(:username)
        assert last_request.env['rack.session'].has_key?(:password)
      end
      
      should 'redirect to the app page on successful login' do
        username, password = 'bob', 'bob'
        
        post '/login', :username => username, :password => 'password'
        assert_equal 302, last_response.status
      end
      
    end
    
    context 'forget' do
      
      should 'clear username and password stored in the session' do
        post '/forget', {}, 
          {'rack.session' => {:username => 'bob', :password => 'bob123'}}
        assert last_request.env['rack.session'].empty?
      end
    end
    
  end
  
  def app
    TagBetter::App
  end
  
end
