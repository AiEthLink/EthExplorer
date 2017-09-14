angular.module('ethExplorer')
    .controller('tokenInfoCtrl', function ($rootScope, $scope, $routeParams, $q, localStorage, localweb3) {
        var web3 = $rootScope.web3;
        $scope.tokenaddress = $routeParams.addressId;

        // var abiCompiled = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [{ "name": "", "type": "string" }], "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "type": "function" }, { "inputs": [{ "name": "_initialAmount", "type": "uint256" }, { "name": "_tokenName", "type": "string" }, { "name": "_decimalUnits", "type": "uint8" }, { "name": "_tokenSymbol", "type": "string" }], "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }];
        // // localStorage.setObjectLocalStorage("0xb2bbca12e11178119b7b58034577aea2127b7669", abiCompiled)
        // //var abi = $.get("/scripts/json/abi.json")
        var abi = $scope.abi = localStorage.getObjectLocalStorage($scope.tokenaddress)
        // console.log("getObjectLocalStorage abi: " + abi)

        var token = web3.eth.contract(abi).at($scope.tokenaddress);

        $scope.tokenname = token.name()
        $scope.tokendecimals = token.decimals()
        $scope.tokensymbol = token.symbol()
        $scope.tokentotalsupply = token.totalSupply()

        for (var index = 0; index < abi.length; index++) {
            var element = abi[index];
            if (element.type == "function") {
                // console.log("function name: " + element.name)
                if (element.constant == true) {
                    if (element.inputs.length == 0) {
                        var s = 'token.' + element.name + '()'
                        element.value = eval(s)
                        // console.log("element value: " + element.value)
                    } else {
                        element.constant = false
                    }
                }
            } else if (element.type == "event" || element.type == "constructor") {
                abi.splice(index)
            }
        }
        // token.transfer('0x657c76a59601eabE5630a54A49Fd39Aa3578882f', 2, {
        //     from: web3.eth.accounts[1],
        //     gas: 1000000
        // })
        // token.balanceOf('0xD7Cb1BC65cC2ad64a996ED5Ce886Eb982789b68B',
        //     function (e, result) {
        //         console.log("token balanceOf1111: " + result);
        //     })


        /* Hello word*/
        // var abiCompiled = [ { "constant": false, "inputs": [], "name": "kill", "outputs": [], "type": "function" }, { "constant": false, "inputs": [ { "name": "_newgreeting", "type": "string" } ], "name": "setGreeting", "outputs": [], "type": "function" }, { "constant": true, "inputs": [], "name": "greet", "outputs": [ { "name": "", "type": "string", "value": "11111" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "greeting", "outputs": [ { "name": "", "type": "string", "value": "11111" } ], "type": "function" }, { "inputs": [ { "name": "_greeting", "type": "string" } ], "type": "constructor" } ];
        // var contract = web3.eth.contract(abiCompiled).at("0x2d243F2F12ea6E22f144B13A8F66EdC46A5DC183");

        // contract.setGreeting("zhangqiang", {from: web3.eth.accounts[0], gas: 100000})
        // result = contract.greeting();
        // console.log("contract greeting: " + result)
        /* End hello word */

        $scope.transactions = []
        $scope.holders = []

        var tokenTxs = []
        var transactions = localStorage.getObjectLocalStorage("transactions")
        for (var index = 0; index < transactions.length; index++) {
            var element = transactions[index];

            if (element.to == $scope.tokenaddress) {
                tokenTxs.push(element)
            }
        }

        var index = 0;
        var iCount = setInterval(function () {
            getTxTo(tokenTxs[index].hash);

            index++;
            if (index == tokenTxs.length) {
                clearInterval(iCount)
                $scope.transfersnum = tokenTxs.length
                getHoldersByInterval()
                $scope.$apply()
            }
        }, 0);

        $scope.execute = function (index) {
            var element = $scope.abi[index]
            var inputs = element.inputs
            var s = 'token.' + element.name + '('
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
                var from = '{from:' + '"' + web3.eth.accounts[0] + '"' + ', gas:' +100000 +'}'
                s += ',' + from + ')'
            }
            // console.log("function execute s: " + s)
            element.value = eval(s)
            // console.log("element value: " + element.value)
        }

        function getTxTo(hash) {
            var deferred = $q.defer();
            localweb3.getTransactionInfos(web3, deferred, hash)
                .then(function (result) {
                    for (var index = 0; index < tokenTxs.length; index++) {
                        var element = tokenTxs[index];

                        if (element.hash == hash) {
                            tokenTxs[index].to = "0x" + result.input.substring(34, 74);
                            tokenTxs[index].value = result.input.substring(75, result.input.length);
                            $scope.transactions.push(tokenTxs[index])

                            break;
                        }
                    }
                });
        }

        function getHoldersByInterval() {
            var index = 0;
            var iCount = setInterval(function () {
                getHolders(index);

                index++;
                if (index == $scope.transactions.length) {
                    clearInterval(iCount)
                }
            }, 0);

        }
        function getHolders(index) {
            console.log("getHolders index: " + index)
            var tx = $scope.transactions[index];
            if (check(tx.to) == false) {
                token.balanceOf(tx.to,
                    function (e, result) {
                        addHolder(tx.to, result)
                    })
            }
            if (check(tx.from) == false) {
                token.balanceOf(tx.from,
                    function (e, result) {
                        addHolder(tx.from, result)
                    })
            }
        }
        function check(address) {
            var holders = $scope.holders
            for (var index = 0; index < holders.length; index++) {
                if (address == holders[index].address) {
                    console.log("address: " + address)
                    console.log("This address is in holders!!!")
                    return true
                }
            }
            return false
        }

        function addHolder(address, balance) {
            if (check(address) == true) {
                return
            }
            
            $scope.holdersnum = $scope.holders.length +1
            var holder = {
                address: address,
                quantity: balance,
                percentage: balance / $scope.tokentotalsupply*100
            }
            
            for (var index = 0; index < $scope.holders.length; index++) {
                if (balance > $scope.holders[index].quantity) {
                    console.log("addHolder index:" + index + " balance:" + balance)
                    
                    $scope.$apply($scope.holders.splice(index, 0, holder))
                    return
                }
            }
            
            $scope.$apply($scope.holders.push(holder))
        }

    });
