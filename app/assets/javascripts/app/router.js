var initialLoad = true;

var Router = Backbone.Router.extend({
  routes: {
    '' : 'nearby',
    'studios/:studioId': 'showStudio',
    'studios/:studioId/yoga_classes/new':'newYogaClass'
  },
  nearby: function () {
    $(studiosListView.el).show();
    studiosListView.render();
    studios.selected = null;
    function foundLocation(position) {
      studios.getNearby(position.coords.latitude, position.coords.longitude);
    }

    function noLocation() {
      alert('Could not find location; please enable location settings for your browser');
    }

    if (initialLoad) {
      initialLoad = false;
      navigator.geolocation.getCurrentPosition(foundLocation, noLocation);  
    }
    
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
  }
});