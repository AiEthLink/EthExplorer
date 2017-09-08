angular.module('ethExplorer')
    .controller('allTransactionsCtrl', function ($rootScope, $scope, $location, localStorage) {
        var maxBlocks = 2000;
        var web3 = $rootScope.web3;
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10);
        $scope.currentblockNum = 0;
        var lastBlockNum = localStorage.getLocalStorage("blockNum", 0)

        // parse transactions
        $scope.transactions = []
        if (lastBlockNum != blockNum) {
            var iCount = setInterval(function () {
                getTransactionFromBlock(blockNum);
                if (blockNum == 0) {
                    localStorage.setLocalStorage("blockNum", $scope.blockNum)
                    clearInterval(iCount)
                }
                $scope.currentblockNum = blockNum;
                $scope.$apply()
                --blockNum;
            }, 0);
        } else {
            var transactions = localStorage.getObjectLocalStorage("transactions")
            for (var index = 0; index < transactions.length; index++) {
                var element = transactions[index];

                $scope.transactions.push(element)
            }
        }

        function getTransactionFromBlock(blockId) {
            web3.eth.getBlockTransactionCount(blockId, function (error, result) {
                var txCount = result

                for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
                    web3.eth.getTransactionFromBlock(blockId, blockIdx, function (error, result) {
                        if (result != null) {
                            var transaction = {
                                hash: result.hash,
                                block: result.blockNumber,
                                from: result.from,
                                to: result.to,
                                gas: result.gas,
                                input: result.input,
                                value: (parseInt(result.value)/1000000000000000000)
                            }

                            $scope.$apply(
                                $scope.transactions.push(transaction)
                            )
                        }
                    })
                }
                if (blockId == 0) {
                    localStorage.setObjectLocalStorage("transactions", $scope.transactions)
                }
            })
        }
    });
