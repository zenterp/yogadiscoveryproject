class StudiosController < ApplicationController
  before_filter :authenticate_user!, only: [:new]

  def new
  	@studios = YogaStudioLead.all.to_json
  end 	

  def search
    @city = cities.delete(params[:location])
    @other_cities = cities
    latlng = @city[:latlng].split(',')
    @location = @city[:name]
    url = "http://yoganow-api.herokuapp.com/yoga_studios.json?lat=#{latlng[0]}&lng=#{latlng[1]}"
    @studios = HTTParty.get(url).parsed_response['studios']    
  end 

  def cities
    @cities ||= City.all    
  end

end
