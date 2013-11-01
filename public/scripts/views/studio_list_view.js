define([
  'backbone', 
  'views/studio_list_item_view'
], function (Backbone, StudioListItemView) {
  var StudiosListView = Backbone.View.extend({
    el: 'tbody',
    render: function () {
      this.$el.empty();
      var self = this;

      this.collection.each(function (studio) {
        var listItemView = new StudioListItemView({model: studio}); 
        self.$el.append(listItemView.el);
      });

      return this;
    }
  });

  return StudiosListView;
})