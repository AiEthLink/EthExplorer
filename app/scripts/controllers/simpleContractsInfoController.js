angular.module('ethExplorer')
    .controller('simpleContractsInfoCtrl', function ($rootScope, $scope, $routeParams, $q, localStorage, localweb3) {
        var web3 = $rootScope.web3;
        $scope.contractaddress = $routeParams.addressId;
        $scope.transactions = []

        var abi = $scope.abi = localStorage.getObjectLocalStorage($scope.contractaddress)
        var contract = web3.eth.contract(abi).at($scope.contractaddress);
        $scope.contractname = contract.name()
        for (var index = 0; index < abi.length; index++) {
            var element = abi[index];
            if (element.type == "function") {
                console.log("function name: " + element.name)
                console.log("function inputs: " + element.input)
            }
        }

        var contractTxs = []
        var transactions = localStorage.getObjectLocalStorage("transactions")
        for (var index = 0; index < transactions.length; index++) {
            var element = transactions[index];

            if (element.to == $scope.contractaddress) {
                contractTxs.push(element)
            }
        }

        $scope.transfersnum = contractTxs.length
        var index = 0;
        if (contractTxs.length > 0) {
            var iCount = setInterval(function () {
                getTxTo(contractTxs[index].hash);
    
                index++;
                if (index == contractTxs.length) {
                    clearInterval(iCount)
                    $scope.$apply()
                }
            }, 0);    
        }

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
