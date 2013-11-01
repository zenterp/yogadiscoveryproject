define(['backbone', 'models/studio', 'vent'], function (Backbone, Studio, vent) {
  var Studios = Backbone.Collection.extend({
    model: Studio,
    el: 'tbody',
    getNearby: function (lat, lng, callback) {
      var url = 'http://yoganow-api.herokuapp.com/api/yoga_classes/nearby.json'
      this.url = url + '?lat=' + lat + '&lng=' + lng;
      this.fetch({
        success: function () {
          vent.trigger('studios:fetchedNearby');
        }
      });
    },
    parse: function (data) {
      return data.yoga_classes;
    },
    findById: function (studioId) {
      var selectedStudio;
      var self = this;
      for (i in self.models) {
        studio = self.models[i];
        if (studio.get('id') == studioId ){
          selectedStudio = studio;
        }
      }
      return selectedStudio;
    },
    upcomingYogaClasses: function () {
      upcomingYogaClasses = [];
      _.each(this.models, function(studio) {
        _.each(studio.get('yoga_classes'), function(yogaClass) {
          yogaClass.studio = studio.attributes;

          dateNow = new Date();
          timeNow = (dateNow.getHours() * 100 + dateNow.getMinutes());

          if (yogaClass.start_time > timeNow) {
            upcomingYogaClasses.push(yogaClass);   
          }
        });
      });
      return _.sortBy(upcomingYogaClasses, function(yogaClass) {
        return yogaClass.start_time;
      });
    }
  });

  var studios = new Studios();

  return studios;
})

