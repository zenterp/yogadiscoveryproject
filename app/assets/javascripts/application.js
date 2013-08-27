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
//= require_tree .

$(function(){
  $(".studiosList").delegate('tr','click', function(e){
    var url = document.location.href;
    document.location.href = url + "/" + $(e.target).parent().find('td:first').data('id');
  });

  function loadCity(city){
    var url = '/studios-near/' + city;
    $.get(url, function(html){
      var $dom = $(html);
      $("#cityCountHeader").html($dom.find("#cityCountHeader").html());
      $(".studiosList").html($dom.find(".studiosList").html());
    });
    document.history.pushState(url,null,url);
  }

  $("#citySelector").live('change', function(){
     loadCity($(this).val());
  });
});