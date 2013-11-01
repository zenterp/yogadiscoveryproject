define(['backbone'], function (Backbone) {
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
      this.$el.append(this.template());
      return this;
    },
    formSubmitted: function (e) {
      e.preventDefault();
      
      data = serializeObject.apply($("form"));
      $('form')[0].reset();

      studios.selected.createYogaClass(data, function (response) {
        vent.trigger('studio:created');
      })
    }
  })

  return StudioNewYogaClassView;
})