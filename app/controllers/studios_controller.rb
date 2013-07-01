class StudiosController < ApplicationController
  before_filter :authenticate_user!, only: [:new]

  def new
  	@studios = YogaStudioLead.all.to_json
  end 	

  def search
    location = params[:location].to_param
    url = "http://yoganow-api.herokuapp.com/yoga_studios.json?location=#{location}"
    @location = params[:location].split('-').join(' ')
    @studios = HTTParty.get(url).parsed_response['yoga_studios']    
  end 
end
