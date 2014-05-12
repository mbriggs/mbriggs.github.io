angular.module('blog-post', []).

directive('post', function(){
  return {
    restrict: 'E',
    templateUrl: 'post.html',
    transclude: true,
    scope: {
      title: '@',
      author: '@',
      datePosted: '@'
    }
  }
});
