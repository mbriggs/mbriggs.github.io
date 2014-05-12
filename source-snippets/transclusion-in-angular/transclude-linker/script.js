angular.module('duplicate-transclusion', []).

controller('duplicateCtrl', function(){
  this.someModel = '';
}).

directive('duplicate', function(){
  return {
    transclude: 'element',
    priority: 1000,
    link: function(scope, el, attrs, ctrl, transclude){
      var times = parseInt(attrs.duplicate, 10);
      var previous = el;
      var childScope;

      for(var i = 0; i < times; i += 1){
        childScope = scope.$new();
        childScope.$index = i;

        transclude(childScope, function(clone){
          previous.after(clone);
          previous = clone;
        });
      }
    }
  }
});
