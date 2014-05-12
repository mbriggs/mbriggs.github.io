angular.module('my-module', []).directive('myGreeting', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      element.click(function(){
        var greetee = attrs.myGreeting || "world";
        alert("Hello, "+ greetee +"!");
      });
    }
  };
});
