class Facebook::SessionsController < ApplicationController
  # GET /auth/facebook/callback
  def create
    begin
      render json: request.env['omniauth.auth']
      session[:facebook] = request.env['omniauth.auth']
    rescue => e
      session[:facebook] = nil
    end 

    redirect_to '/'
  end 
end
