define([
  'backbone',
  'views/yoga_class_list_item_view', 
  'models/yoga_class'
], function (Backbone, YogaClassListItemView, YogaClass) {
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
      _.each(this.yogaClasses, function(yc) {
        yogaClass = new YogaClass(yc);
        yogaClass.subtitle = yc.studio.name || '';
        listItemView = new YogaClassListItemView({ model: yogaClass });
        $('tbody').append(listItemView.$el);
      });
    }
  })
  
  return YogaClassesView;  
})
  