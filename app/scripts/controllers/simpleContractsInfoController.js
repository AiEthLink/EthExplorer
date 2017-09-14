angular.module('ethExplorer')
    .controller('simpleContractsInfoCtrl', function ($rootScope, $scope, $routeParams, $q, localStorage, localweb3) {
        var web3 = $rootScope.web3;
        $scope.contractaddress = $routeParams.addressId;
        $scope.transactions = []

        var abi = $scope.abi = localStorage.getObjectLocalStorage($scope.contractaddress)
        var contract = web3.eth.contract(abi).at($scope.contractaddress);
        $scope.contractname = contract.name()
        // {"constant":false,"inputs":[{"name":"channelId","type":"bytes32"}],
        // "name":"deposit","outputs":[],"payable":true,"type":"function"}
        for (var index = 0; index < abi.length; index++) {
            var element = abi[index];
            if (element.type == "function") {
                console.log("function name: " + element.name)
                if (element.constant == true && element.inputs.length == 0) {
                    if (element.inputs.length == 0) {
                        var s = 'contract.' + element.name + '()'
                        element.value = eval(s)
                        console.log("element value: " + element.value)
                    } else {
                        element.constant = false
                    }
                }
            } else if (element.type == "event" || element.type == "constructor") {
                abi.splice(index)
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

        $scope.execute = function (index) {
            var element = $scope.abi[index]
            var inputs = element.inputs
            var s = 'contract.' + element.name + '('
            for (var index = 0; index < inputs.length; index++) {
                var input = inputs[index];
                if (index == 0) {
                    s += '"' + input.value + '"'
                } else {
                    s += ',' + '"' + input.value + '"'
                }
            }
            if (element.constant == true) {
                s += ')'
            } else {
                var from = '{from:' + '"' + web3.eth.accounts[0] + '"' + ', gas:' + 100000 + '}'
                s += ',' + from + ')'
            }
            console.log("function execute s: " + s)
            element.value = eval(s)
            console.log("element value: " + element.value)
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
