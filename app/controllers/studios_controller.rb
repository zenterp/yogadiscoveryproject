class StudiosController < ApplicationController
  before_filter :authenticate_user!, only: [:new]

  def new
  	@studios = YogaStudioLead.all.to_json
  end 	

  def search
    city = cities[params[:location]]
    latlng = city[:latlng].split(',')
    @location = city[:name]
    url = "http://yoganow-api.herokuapp.com/yoga_studios.json?lat=#{latlng[0]}&lng=#{latlng[1]}"
    @studios = HTTParty.get(url).parsed_response['studios']    
  end 

  def cities
    {
      'san-francisco-ca' => {
        latlng: '37.7750,-122.4167',
        name: "San Francisco, California"
      },
      'austin-tx' => {
        latlng: '30.2669,-97.7500',
        name: "Austin, Texas"
      },    
      'boulder-co' => {
        latlng: '40.0176,-105.2797',
        name: "Boulder, Colorado"
      },
      'denver-co' => {
        latlng: '39.7392,-104.9842',
        name: "Denver, Colorado"
      },
      'portland-or' => {
        latlng: '45.5200,-122.6819',
        name: "Portland, Oregon"
      },
      'berkeley-ca' => {
        latlng: '37.8717,-122.2728',
        name: "Berkeley, California"
      }
    }
  end

end
