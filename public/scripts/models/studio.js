define(['backbone'], function (Backbone) {

  var Studio = Backbone.Model.extend({
    select: function () {
      console.log('studio selected');
    },
  
    createYogaClass: function (params, callback) {
      var self = this;
      params.yoga_studio_id = self.get('id');
      var url = 'http://yoganow-api.herokuapp.com/api/yoga_studios/'+self.get('id')+'/yoga_classes.json'
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          yoga_class: params
        },
        success: function(data){
          callback(data);
        }
      })
    }
  });

  return Studio;
});