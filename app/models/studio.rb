class Studio
  class << self
    def find(lat, lng)
      url = "http://yoganow-api.herokuapp.com/api/yoga_studios.json?lat=#{lat}&lng=#{lng}"
      if (studios = REDIS.get(url)).present?
        studios = JSON.parse(studios)
      else
        studios = HTTParty.get(url).parsed_response['studios']
        REDIS.set url, studios.to_json
      end
      studios
    end

    def classes(studio_id)
      url = "http://yoganow-api.herokuapp.com/api/yoga_studios/#{studio_id}/yoga_classes.json"
      if (studio_and_classes = REDIS.get(url)).present?
        studio_and_classes = JSON.parse(studio_and_classes)
      else
        studio_and_classes = HTTParty.get(url).parsed_response
        REDIS.set url, studio_and_classes.to_json
      end
      studio_and_classes
    end
  end 


end