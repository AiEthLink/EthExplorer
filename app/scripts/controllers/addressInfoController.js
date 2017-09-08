angular.module('ethExplorer')
  .controller('addressInfoCtrl', function ($rootScope, $scope, $location, $routeParams, $q, localStorage, localweb3) {

    var web3 = $rootScope.web3;

    $scope.init = function () {
      $scope.addressId = $routeParams.addressId;

      if ($scope.addressId !== undefined) {
        var deferred = $q.defer();
        localweb3.getAddressInfos(web3, deferred, $scope.addressId).then(function (result) {
          $scope.balance = result.balance;
          $scope.balanceInEther = result.balanceInEther;
        });
      }
    };

    $scope.init();

    $scope.processAbiRequest = function () {
      localStorage.setObjectLocalStorage($scope.addressId, eval($scope.ethRequest))
      var abi = localStorage.getObjectLocalStorage($scope.addressId)
      if (abi != null) {
        alert("Abi value had added!!!!");
      }
    }
  });
