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

  def show
    studio_and_classes = Studio.classes(params[:id])
    @yoga_studio = studio_and_classes['studio']
    classes = []

    today = Time.now.strftime("%A").downcase

    studio_and_classes['classes'].each do |key, val|
      classes.push(studio_and_classes['classes'][key])
    end
    @yoga_classes = studio_and_classes['classes'][today] || []
  end
end
