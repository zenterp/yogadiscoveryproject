define(['backbone','time_manager'], function (Backbone, TimeManager){
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
  
  return YogaClassListItemView
});