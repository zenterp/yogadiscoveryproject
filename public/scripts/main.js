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

require(["jquery", "underscore", "backbone", "backbone.marionette.min", "time_manager"], function($, _, Backbone, Marionette, TimeManager) {
    console.log($);
    console.log(_);
    console.log(Backbone);

    $(function(){
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
          console.log('get nearby', url);
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
            yogaClass.subtitle = yc.studio.name || '';
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
          json.end_time = TimeManager.decorateTime(
            TimeManager.addMinutesToTime(
              json.start_time, json.duration
            )
          );
          json.start_time = TimeManager.decorateTime(json.start_time);
          try {
            json.subtitle = json.studio.name;
          } catch(e) {
            json.subtitle = '';
          }
          
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

      $(function() {
        $('nav a, .footerNav a').on('click', function (e) {
          e.preventDefault();
          url = $(this).attr('href');
          router.navigate(url, { trigger: true });
        })

        $('#add').on('click', function (e) {
          e.preventDefault();
          console.log(studios);
          vent.trigger('yogaClasses:new', studios.selected.get("id"));
        })
      })

      window.studios = new Studios();
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

      router.navigate('/yoga-studios/upcoming', { trigger : true });
      console.log('ready');
    });
});