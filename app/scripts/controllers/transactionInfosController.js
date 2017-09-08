angular.module('ethExplorer')
    .controller('transactionInfosCtrl', function ($rootScope, $scope, $location, $routeParams, $q, localweb3) {

        var web3 = $rootScope.web3;

        $scope.init = function () {
            $scope.txId = $routeParams.transactionId;

            if ($scope.txId !== undefined) { // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...

                var deferred = $q.defer();
                localweb3.getTransactionInfos(web3, deferred, $scope.txId)
                    .then(function (result) {
                        //TODO Refactor this logic, asynchron calls + services....
                        var number = web3.eth.blockNumber;

                        $scope.result = result;

                        if (result.blockHash !== undefined) {
                            $scope.blockHash = result.blockHash;
                        }
                        else {
                            $scope.blockHash = 'pending';
                        }
                        if (result.blockNumber !== undefined) {
                            $scope.blockNumber = result.blockNumber;
                        }
                        else {
                            $scope.blockNumber = 'pending';
                        }
                        $scope.from = result.from;
                        $scope.gas = result.gas;
                        $scope.gasPrice = result.gasPrice.c[0] + " WEI";
                        $scope.hash = result.hash;
                        $scope.input = result.input; // that's a string
                        $scope.nonce = result.nonce;
                        $scope.to = result.to;
                        $scope.transactionIndex = result.transactionIndex;
                        $scope.ethValue = result.value.c[0] / 10000;
                        $scope.txprice = (result.gas * result.gasPrice) / 1000000000000000000 + " ETH";
                        if ($scope.blockNumber !== undefined) {
                            $scope.conf = number - $scope.blockNumber;
                            if ($scope.conf === 0) {
                                $scope.conf = 'unconfirmed'; //TODO change color button when unconfirmed... ng-if or ng-class
                            }
                        }
                        //TODO Refactor this logic, asynchron calls + services....
                        if ($scope.blockNumber !== undefined) {
                            var info = web3.eth.getBlock($scope.blockNumber);
                            if (info !== undefined) {
                                $scope.time = info.timestamp;
                            }
                        }
                    });
            }

            else {
                $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
            }
        };
        $scope.init();
        console.log($scope.result);

    });
