class Studio
  class << self
    def find(lat, lng)
      url = "http://yoganow-api.herokuapp.com/api/yoga_studios.json?lat=#{lat}&lng=#{lng}"
      studios = HTTParty.get(url).parsed_response['studios']
    end

    def search_near_coordinates(lat, lng)
      url = "http://yoganow-api.herokuapp.com/api/yoga_studios.json?lat=#{lat}&lng=#{lng}"
      studios = HTTParty.get(url).parsed_response['studios']
    end

    def classes(studio_id)
      url = "http://yoganow-api.herokuapp.com/api/yoga_studios/#{studio_id}/yoga_classes.json"
      studio_and_classes = HTTParty.get(url).parsed_response
    end
  end 
end