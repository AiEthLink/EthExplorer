angular.module('ethExplorer')
    .controller('simpleContractsInfoCtrl', function ($rootScope, $scope, $routeParams, $q, localStorage, localweb3) {
        var web3 = $rootScope.web3;
        $scope.contractaddress = $routeParams.addressId;

        var abi = $scope.abi = localStorage.getObjectLocalStorage($scope.contractaddress)

        var contract = web3.eth.contract(abi).at($scope.contractaddress);

        $scope.transactions = []

        var contractTxs = []
        var transactions = localStorage.getObjectLocalStorage("transactions")
        for (var index = 0; index < transactions.length; index++) {
            var element = transactions[index];

            if (element.to == $scope.contractaddress) {
                contractTxs.push(element)
            }
        }

        var index = 0;
        var iCount = setInterval(function () {
            getTxTo(contractTxs[index].hash);

            index++;
            if (index == contractTxs.length) {
                clearInterval(iCount)
                $scope.transfersnum = contractTxs.length
                $scope.$apply()
            }
        }, 0);

        function getTxTo(hash) {
            var deferred = $q.defer();
            localweb3.getTransactionInfos(web3, deferred, hash)
                .then(function (result) {
                    for (var index = 0; index < contractTxs.length; index++) {
                        var element = contractTxs[index];

                        if (element.hash == hash) {
                            contractTxs[index].to = "0x" + result.input.substring(34, 74);
                            contractTxs[index].value = result.input.substring(75, result.input.length);
                            $scope.transactions.push(contractTxs[index])

                            break;
                        }
                    }
                });
        }
    });
