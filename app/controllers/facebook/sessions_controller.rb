class Facebook::SessionsController < ApplicationController # GET /auth/facebook/callback
  def create
    begin
      session[:facebook] = {
        uid: auth_hash[:uid],
        credentials: auth_hash[:credentials],
        name: auth_hash[:info][:name]
      } 
    rescue => e
      session[:facebook] = nil
    end 
  end 
  
  def auth_hash
    request.env['omniauth.auth']
  end
end
