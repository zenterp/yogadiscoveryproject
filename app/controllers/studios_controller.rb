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

    @studios = Studio.find(latlng[0], latlng[1])
  end 

  def cities
    @cities ||= City.all    
  end
end
