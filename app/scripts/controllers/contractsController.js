angular.module('ethExplorer')
    .controller('contractsCtrl', function ($rootScope, $scope, $routeParams, localStorage) {
        var web3 = $rootScope.web3;
        var contractType = $routeParams.contractType;
        $scope.contractaddress = [];
        $scope.tokeninfos = []
        $scope.simpleinfos = []

        if (contractType == 0) {
            $scope.tokensIsShow = true
            $scope.othersIsShow = false
            $scope.title = "Token Tracker"
        } else {
            $scope.tokensIsShow = false
            $scope.othersIsShow = true
            $scope.title = "Other Contracts Tracker"
        }
        $scope.transactions = localStorage.getObjectLocalStorage("transactions")
        var transactions = $scope.transactions;

        for (var index = 0; index < transactions.length; index++) {
            var element = transactions[index];

            if (element.to != null && checkAddress(element.to) == false) {
                if (element.input != '0x') {
                    $scope.contractaddress.push(element.to)
                }
            }
        }

        var index = $scope.contractaddress.length;
        console.log("contractaddress length: " + index)
        var iCount = setInterval(function () {
            --index;
            if (index == 0) {
                clearInterval(iCount)
            }

            getTokenInfo($scope.contractaddress[index]);
            $scope.$apply()
        }, 0);

        function getTokenInfo(address) {
            console.log("getTokenInfo address: " + address)

            var abi = eval(localStorage.getLocalStorage(address, null))
            if (abi != null) {
                var contract = web3.eth.contract(abi).at(address);
                if (contractType == 0 && contract.totalSupply()) {
                    addTokenInfo($scope.tokeninfos, contract, address)
                } else {
                    abi.forEach(function(element) {
                        console.log("element name: " + element.name)
                        console.log("element type: " + element.type)
                        if (element.type == "constructor") {
                            console.log("element input: " + element.inputs)
                            addSimpleInfo($scope.simpleinfos, contract, address, element.inputs)
                        }
                    }, this);
                }
            }
        }

        function addTokenInfo(tokeninfos, token, address) {
            var marketprice = 2;
            var tokenInfo = {
                name: token.name(),
                address: address,
                price: marketprice,
                change: '↑5.37%',
                marketcap: token.totalSupply() * marketprice
            }
            // $scope.$apply(
            tokeninfos.push(tokenInfo)
            // )
        }
        function addSimpleInfo(simpleinfos, contract, address, constructor) {
            var simpleInfo = {
                name: contract.name(),
                address: address,
                constructor: constructor
            }
            // $scope.$apply(
            simpleinfos.push(simpleInfo)
            // )
        }

        function checkAddress(addressHash) {
            for (var index = 0; index < $scope.contractaddress.length; index++) {
                var element = $scope.contractaddress[index];

                if (element != null && element == addressHash) {
                    return true;
                }
            }
            return false;
        }
    });
