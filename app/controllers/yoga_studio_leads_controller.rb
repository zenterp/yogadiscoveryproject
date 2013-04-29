class YogaStudioLeadsController < ApplicationController

  def index
  	render json: YogaStudioLead.all.to_json
  end 	
  
  def create
  	if YogaStudioLead.create(params[:lead])
  		redirect_to :back
  	else 
  		render status: 406 # not acceptable
  	end
  end
end
