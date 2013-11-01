define(['backbone', 'yoga_class'], function(Backbone, YogaClass) {
  var YogaClasses = Backbone.Collection.extend({
    model: YogaClass,
    getUrl: function (studioId) {
      return 'http://yoganow-api.herokuapp.com/api/studios'+studioId+'yoga_classes.json'
    }
  });

  return YogaClasses;  
})

