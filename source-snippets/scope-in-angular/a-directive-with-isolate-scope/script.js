angular.module('with-scope', []).

controller('Ctrl', function($scope){
  $scope.model = {
    number: 40
  };
}).

directive('evenOrOdd', function(){
  return {
    restrict: 'E',
    scope: {
      'number': '='
    },
    template: "<input style='width: 40px; display: inline' type='text' ng-model='number' /> {{evenOrOdd}}",

    link: function(scope, el, attrs){

      scope.$watch('number', function(val){
        // publish whether the number is even or odd
        scope.evenOrOdd = (val % 2) ? 'odd' : 'even';
      });
    }
  }
});
