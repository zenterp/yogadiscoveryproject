require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});

require([ 
  "jquery", 
  "underscore", 
  "backbone", 
  'backbone.wreqr',
  "marionette", 
  "time_manager", 
  "collections/studios",
  "models/yoga_class",
  "views/yoga_class_list_item_view",
  "vent",
  "views/yoga_classes_view",
  "views/studio_list_item_view",
  "views/studio_details_view",
  "views/studio_new_yoga_class_view",
  "views/studio_list_view",
  "router"
], function($, _, Backbone, Wreqr, Marionette, TimeManager, 
            studios, YogaClass, YogaClassListItemView, vent,
            YogaClassesView, StudioListItemView, StudioDetailsView,
            StudioNewYogaClassView, StudiosListView, Router) {

    $('nav a, .footerNav a').on('click', function (e) {
      e.preventDefault();
      url = $(this).attr('href');
      router.navigate(url, { trigger: true });
    })

    $('#add').on('click', function (e) {
      e.preventDefault();
      vent.trigger('yogaClasses:new', studios.selected.get("id"));
    })

    studiosListView = new StudiosListView({ collection: studios });

    vent.bind('studios:fetchedNearby', function () {
      studiosListView.render();
    });

    vent.bind('studio:selected', function (id) {
      console.log('selected');
      router.navigate('/studios/'+id, { trigger : true });
    });

    vent.bind('studio:created', function () {
      alert('studio created! high five!\n\n How about another?');
    });

    vent.bind('yogaClasses:new', function (yogaStudioId) {
      router.navigate('/studios/'+yogaStudioId+'/yoga_classes/new', { trigger : true });
    });

    var router = new Router();
    Backbone.history.start({
      pushState: true,
      silent: false
    });

    router.navigate('/yoga-studios/nearby', { trigger : true });
});