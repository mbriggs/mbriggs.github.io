(function() {
  function isDiv5(num) {
    return !(num % 5);
  }

  function isDiv3(num) {
    return !(num % 3);
  }

  angular.module('fizz-buzz-example', []).

  controller('CountsCtrl', function($scope) {
    $scope.counts = {
      fizzBuzz: 0,
      fizz: 0,
      buzz: 0
    }
  }).

  directive('fizzBuzz', function() {
    return {
      restrict: 'A',
      link: function(scope, el) {
        scope.counts.fizzBuzz += 1;
        el.html('FizzBuzz!!');
      }
    }
  }).

  directive('fizz', function() {
    return {
      restrict: 'A',
      link: function(scope, el) {
        scope.counts.fizz += 1;
        el.html('Fizz!!');
      }
    }
  }).

  directive('buzz', function() {
    return {
      restrict: 'A',
      link: function(scope, el) {
        scope.counts.buzz += 1;
        el.html('Buzz!!');
      }
    }
  }).

  directive('fizzBuzzer', function() {
    return {
      restrict: 'A',
      compile: function(el) {
        el.children().each(function(i, child) {
          var num = parseInt(child.innerHTML, 10);

          if (isDiv3(num) && isDiv5(num)) child.setAttribute('fizz-buzz', '');
          else if (isDiv3(num)) child.setAttribute('fizz', '');
          else if (isDiv5(num)) child.setAttribute('buzz', '');
        });
      }
    }
  });

}());
