define([
  'backbone', 
  'models/yoga_class',
  'views/yoga_class_list_item_view',
], function (Backbone, YogaClass, YogaClassListItemView) {
  
  function buildMapUrl (lat, lng) {
    return "http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lng+"&zoom=16&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C"+lat+","+lng+"&sensor=false"
  }

  var StudioDetailsView = Backbone.View.extend({
    el: 'tbody',
    initialize: function () {
      _.bindAll(this, 'render');
      this.render();
    },
    render: function () {
      this.$el.empty(); 
      var self = this;
  
      $img = $("<div/>");
      $img.css('height', '150px');
      width = $('body').css('width');
      $img.css('width', width);
      url = buildMapUrl(this.model.get('latitude'), this.model.get('longitude'));
      console.log(url);
      $img.css('background-image', "url('"+url+"')");
      $img.css('background-size', "100% 100%");
      this.$el.append($img);
  
      _.each(this.model.get('yoga_classes'), function(json) {
        yogaClass = new YogaClass(json);
        listItemView = new YogaClassListItemView({ model: yogaClass });
        self.$el.append(listItemView.$el);
      });
  
      this.$el.html();
      return this;
    }
  });
  return StudioDetailsView;
})