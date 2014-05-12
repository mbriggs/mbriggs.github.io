angular.module('employee-directory', []).

controller('DirectoryCtrl', function($scope, directory){
  $scope.employees = [
    { name: "Kent Beck", address: "Southern Oregon" },
    { name: "Uncle Bob", address: "Chicago" },
    { name: "Rich Hickey", address: "New York" }
  ];

  $scope.addToDirectory = directory.addForUser;
}).

factory('directory', function(){
  return {
    addForUser: function(userId, employee){
      alert('added ' + employee.name + ' to user ' + userId + ' directory');
    }
  }
}).


run(function($rootScope){
  $rootScope.currentUser = {
    id: 1,
    name: 'The User'
  }
});
