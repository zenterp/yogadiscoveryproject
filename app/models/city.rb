class City
  def self.all
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