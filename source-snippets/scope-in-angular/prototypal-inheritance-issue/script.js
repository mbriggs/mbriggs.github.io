angular.module('prototypal-inheritance-issue', []).

controller('Outer', function($scope){
  $scope.someValue = "outerValue";
  $scope.someModel = { val: "model value" }
}).

controller('Inner', function($scope){
});
