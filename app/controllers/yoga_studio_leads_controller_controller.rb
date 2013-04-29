class YogaStudioLeadsControllerController < ApplicationController

  def index
  	render json: YogaStudioLead.all.to_json
  end 	
  
  def create
  	if YogaStudioLead.create(params)
  		render status: 201 # created
  	else 
  		render status: 406 # not acceptable
  	end
  end
end
