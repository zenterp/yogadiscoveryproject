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
  end 
end