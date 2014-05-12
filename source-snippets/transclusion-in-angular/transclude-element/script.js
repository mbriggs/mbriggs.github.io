angular.module('transclude-element', []).

directive('dropPanel', function(){
  return {
    transclude: 'element',
    replace: true,
    templateUrl: 'drop-panel.html',
    link: function(scope, el){
      var input = el.find('input[drop-panel]');

      input.focus(function(){
        el.addClass('is-active');
      });

      input.blur(function(){
        el.removeClass('is-active');
      });
    }
  }
});
