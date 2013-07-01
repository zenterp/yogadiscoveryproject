class Admin::StudioLeadsController < Admin::ApplicationController
  before_filter :authenticate_admin!

  def authenticate_admin!
    User.is_admin?(session[:current_user_id])
  end 
end 

