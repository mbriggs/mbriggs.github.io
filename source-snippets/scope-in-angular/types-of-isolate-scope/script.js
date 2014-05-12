angular.module('isolate-scope', []).

controller('Ctrl', function($scope){
  $scope.twoWayCtrl = "This is the value for two-way databinding";
  $scope.oneWayCtrl = "This is the value for one-way databinding";

  $scope.methodCtrl = function(message){
    alert('this is the message: '+ message);
  }
}).

directive('isolated', function(){
  return {
    restrict: 'A',
    scope: {
      twoWay: '=',
      oneWay: '@',
      method: '&'
    },

    templateUrl: 'isolated.html'
  }
});
