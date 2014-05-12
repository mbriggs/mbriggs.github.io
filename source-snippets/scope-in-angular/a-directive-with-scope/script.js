angular.module('with-scope', []).

controller('Ctrl', function($scope){
  $scope.model = {
    number: 40
  };
}).

directive('evenOrOdd', function($parse){
  return {
    restrict: 'E',
    template: "<input style='width: 40px; display: inline' type='text' ng-model='evenOrOddNumber' /> {{evenOrOdd}}",

    link: function(scope, el, attrs){
      var number = $parse(attrs.number);

      // assign number to local scope
      scope.$watch(number, function(val){
        scope.evenOrOddNumber = val;
      });

      scope.$watch('evenOrOddNumber', function(val){
        // publish whether the number is even or odd
        scope.evenOrOdd = (val % 2) ? 'odd' : 'even';

        // sync number with outer scope
        number.assign(scope, val);
      });
    }
  }
});
