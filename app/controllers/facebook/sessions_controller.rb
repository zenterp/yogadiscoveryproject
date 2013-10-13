class Facebook::SessionsController < ApplicationController # GET /auth/facebook/callback
  def create
    begin
      session[:facebook] = {
        uid: auth_hash[:uid],
        credentials: auth_hash[:credentials],
        name: auth_hash[:info][:name]
      } 
      redirect_to '/', notice: 'logged in with facebook successful'
    rescue => e
      session[:facebook] = nil
      redirect_to '/', notice: 'logged in with facebook failed'
    end 
   
  end 
  
  def auth_hash
    request.env['omniauth.auth']
  end
end
