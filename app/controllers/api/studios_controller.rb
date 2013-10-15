class Api::StudiosController < ApplicationController
  def create
    if YogaStudioLead.create(params[:lead])
      redirect_to :back
    else 
      render status: 406 # not acceptable
    end
  end

  def index
    render json: Studio.find(params[:lat], params[:lng])
  end
end 