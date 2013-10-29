// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require underscore-min
//= require backbone-min
//= require_tree .

_.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};

serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function buildMapUrl (lat, lng) {
  return "http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lng+"&zoom=16&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C"+lat+","+lng+"&sensor=false"
}

var vent = _.extend({}, Backbone.Events);

var Studio = Backbone.Model.extend({
  select: function () {
    console.log('studio selected');
  },

  createYogaClass: function (params, callback) {
    var self = this;
    params.yoga_studio_id = self.get('id');
    console.log('params');
    console.log(params);
    var url = 'http://yoganow-api.herokuapp.com/api/yoga_studios/'+self.get('id')+'/yoga_classes.json'
    $.ajax({
      type: 'POST',
      url: url,
      data: {
        yoga_class: params
      },
      success: function(data){
        console.log(data);
        callback(data);
      }
    })
  }
});

var YogaClass = Backbone.Model.extend();

var YogaClasses = Backbone.Collection.extend({
  model: YogaClass,
  getUrl: function (studioId) {
    return 'http://yoganow-api.herokuapp.com/api/studios'+studioId+'yoga_classes.json'
  }
});

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
        upcomingYogaClasses.push(yogaClass); 
      });
    });
    return upcomingYogaClasses;
  }
});

var YogaClassesView = Backbone.View.extend({
  el: 'tbody',
  initialize: function (opts) {
    _.bindAll(this, 'render');
    this.yogaClasses = opts.yogaClasses;
    this.render();
  },
  render: function () {
    this.$el.empty();
    var self = this;
    console.log(self.$el);
    _.each(this.yogaClasses, function(yc) {
      yogaClass = new YogaClass(yc);
      listItemView = new YogaClassListItemView({ model: yogaClass });
      $('tbody').append(listItemView.$el);
      console.log(listItemView.$el);
    });

    console.log('things');
  }
})

var StudioDetailsView = Backbone.View.extend({
  el: 'tbody',
  initialize: function () {
    _.bindAll(this, 'render');
    this.render();
  },
  render: function () {
    this.$el.empty(); 
    var self = this;

    $img = $("<img/>");
    $img.attr('src', buildMapUrl(this.model.get('latitude'), this.model.get('longitude')));
    this.$el.append($img);

    _.each(this.model.get('yoga_classes'), function(json) {
      yogaClass = new YogaClass(json);
      listItemView = new YogaClassListItemView({ model: yogaClass });
      self.$el.append(listItemView.$el);
    });

    this.$el.html();
    return this;
  }
})

var StudioNewYogaClassView = Backbone.View.extend({
  el: 'tbody',
  template: _.template($("#newClassFormTemplate").html()),
  initialize: function () {
    _.bindAll(this, 'render');
    this.render();
  },
  events : {
    'submit form' : 'formSubmitted'
  },
  render: function () {
    this.$el.empty();
    console.log(this.template());
    this.$el.append(this.template());
    return this;
  },
  formSubmitted: function (e) {
    e.preventDefault();
    
    data = serializeObject.apply($("form"));
    $('form')[0].reset();

    studios.selected.createYogaClass(data, function (response) {
      console.log(response);
      vent.trigger('studio:created');
    })
  }
})


var YogaClassListItemView = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    _.bindAll(this, 'render');
    this.render();
  },

  template: _.template($('#yogaClassRowTemplate').html()),

  render: function () {
    json = this.model.attributes;
    this.$el.html(this.template(json));
    return this;
  }
});

var StudiosListView = Backbone.View.extend({
  el: 'tbody',
  render: function () {
    this.$el.empty(); // clear the element to make sure you don't double your contact view
    var self = this; // so you can use this inside the each function

    this.collection.each(function (studio) { // iterate through the collection
      var listItemView = new StudioListItemView({model: studio}); 
      self.$el.append(listItemView.el);
    });

    return this;
  }
})

var StudioListItemView = Backbone.View.extend({
  initialize: function () {
    _.bindAll(this, 'render', 'studioSelected');
    this.render();
  },
  tagName: 'tr',
  className: 'studioRow',
  events: {
    'click a' : 'studioSelected'
  },

  template: _.template($("#studioRowTemplate").html()),

  render: function () {
    studio = this.model.attributes;
    obj = {
      name: studio.name.substring(0,19),
      id: studio.id,
      distance: Math.round(studio.distance * 100) / 100,
      classes_today_count: studio.yoga_classes.length
    }
    this.$el.html(this.template(obj));
    return this;
  },

  studioSelected : function (e) {
    e.preventDefault();
    vent.trigger('studio:selected', this.model.get('id'));
  }
})

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

$('nav a').on('click', function (e) {
  e.preventDefault();
  url = $(this).attr('href');
  router.navigate(url, { trigger: true });
})

$('#add').on('click', function (e) {
  e.preventDefault();
  console.log(studios);
  vent.trigger('yogaClasses:new', studios.selected.get("id"));
})

var studios = new Studios();
studiosListView = new StudiosListView({ collection: studios });

vent.bind('studios:fetchedNearby', function () {
  studiosListView.render();
});

vent.bind('studio:selected', function (id) {
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

router.navigate('/');
