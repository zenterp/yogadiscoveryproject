define([
  'backbone', 
  'views/studio_details_view',
  'views/studio_new_yoga_class_view',
  'views/yoga_classes_view',
  'collections/studios'
], function (Backbone, StudioDetailsView, StudioNewYogaClassView, YogaClassesView, studios) {
  var initialLoad = true;

  var Router = Backbone.Router.extend({
    routes: {
      '' : 'nearby',
      'yoga-studios/nearby': 'nearby',
      'studios/:studioId': 'showStudio',
      'studios/:studioId/yoga_classes/new':'newYogaClass',
      'yoga-classes/upcoming':'upcomingYogaClasses'
    },
    nearby: function () {
      if (initialLoad) {
        initialLoad = false;
        function foundLocation(position) {
          studios.getNearby(position.coords.latitude, position.coords.longitude);
        }
        function noLocation() {
          alert('Could not find location; please enable location settings for your browser');
        }
        navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
      }
      $(studiosListView.el).show();
      studiosListView.render();
      $('span.headerTitle').html('Yoga Discovery Project');
    },
    showStudio: function (studioId) {
      selectedStudio = studios.findById(studioId);
      studios.selected = selectedStudio;
      var studioDetailsView = new StudioDetailsView({ model: selectedStudio });
      $('span.headerTitle').html(selectedStudio.get('name'));
    },
    newYogaClass: function () {
      $('span.headerTitle').html();
      new StudioNewYogaClassView;
    },
    upcomingYogaClasses: function () {
      $('tbody').html('');

      if (!upcomingYogaClassesView) {
        var upcomingYogaClassesView = new YogaClassesView({ yogaClasses: studios.upcomingYogaClasses() });
      }

      if (!sortedYogaClasses) {
        var sortedYogaClasses = [];
      }
    }
  });

  return Router;
})