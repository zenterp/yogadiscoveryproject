class Facebook::SessionsController < ApplicationController # GET /auth/facebook/callback
  def create
    begin
      render json: request.env['omniauth.auth']
    rescue => e
      render json: 'error'
      session[:facebook] = nil
    end 
  end 
end
