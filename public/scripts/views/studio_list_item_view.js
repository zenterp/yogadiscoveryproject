define(['backbone', 'vent'], function (Backbone, vent) {
  var StudioListItemView = Backbone.View.extend({
    initialize: function () {
      _.bindAll(this, 'render', 'studioSelected');
      this.render();
    },
    tagName: 'tr',
    className: 'studioRow',
    events: {
      'click' : 'studioSelected'
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
  }); 

  return StudioListItemView; 
})
