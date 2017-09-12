angular.module('ethExplorer')
    .controller('mainCtrl', function ($rootScope, $scope, $location, localStorage) {

        var web3 = $rootScope.web3;
        var maxBlocks = $scope.maxBlocks = 20; // TODO: into setting file or user select
        var pageNum = localStorage.getLocalStorage("pageNum", 0);
        
        $scope.coinbase = parseInt(web3.eth.coinbase, 10);
        $scope.gasPrice = parseInt(web3.eth.gasPrice, 10);
        $scope.hashrate = parseInt(web3.eth.hashrate, 10);
        $scope.mining = parseInt(web3.eth.mining, 10);
        $scope.peerCount = parseInt(web3.net.peerCount, 10)+1;
        $scope.netVersion = parseInt(web3.net.version, 10);
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10);
        if (maxBlocks > blockNum) {
            maxBlocks = blockNum + 1;
        }
        $scope.uncleCount = parseInt(web3.eth.getBlockUncleCount(blockNum), 10);

        var timestamp = Date.parse(new Date())/1000;
        // get latest maxBlocks blocks
        $scope.blocks = [];
        for (var i = 0; i < maxBlocks; ++i) {
            number = blockNum - i - pageNum * maxBlocks;
            if (number < 0) {
                number = 0;
            }
            var block = web3.eth.getBlock(number)
            block.switchedtimestamp = switchTimestamp(timestamp - block.timestamp)
            $scope.blocks.push(block);
            if (number == 0) {
                break;
            }
        }

        var currentblock = $scope.blocks[0]
        var mistiming = timestamp - currentblock.timestamp
        $scope.lastBlockTime = switchTimestamp(mistiming)
        var preblock = $scope.blocks[maxBlocks-1]
        var averagemistiming = currentblock.timestamp - preblock.timestamp
        $scope.averageBlockTime = switchTimestamp(averagemistiming)
        $scope.gasLimit = currentblock.gasLimit
        $scope.totalDifficulty = parseInt(currentblock.totalDifficulty)

        $scope.transactions = []//localStorage.getObjectLocalStorage("transactions")
        var transactions = localStorage.getObjectLocalStorage("transactions")
        maxindex = Math.min(transactions.length, maxBlocks) 
        for (var index = 0; index < maxindex; index++) {
            var element = transactions[index];

            $scope.transactions.push(element)
        }

        $scope.processRequest = function () {
            var requestStr = $scope.ethRequest.split('0x').join('');

            if (requestStr.length === 40)
                return goToAddrInfos(requestStr)
            else if (requestStr.length === 64) {
                if (/[0-9a-zA-Z]{64}?/.test(requestStr))
                    return goToTxInfos('0x' + requestStr)
                else if (/[0-9]{1,7}?/.test(requestStr))
                    return goToBlockInfos(requestStr)
            } else if (parseInt(requestStr) > 0)
                return goToBlockInfos(parseInt(requestStr))

            alert('Don\'t know how to handle ' + requestStr)
        };


        function goToBlockInfos(requestStr) {
            $location.path('/block/' + requestStr);
        }

        function goToAddrInfos(requestStr) {
            $location.path('/address/' + requestStr);
        }

        function goToTxInfos(requestStr) {
            $location.path('/transaction/' + requestStr);
        }

        function switchTimestamp(mistiming) {
            if (mistiming >= 3600) {
                time = ((mistiming / 3600).toFixed(2)).toString() + " h"
            } else if (mistiming >= 60) {
                time = ((mistiming / 60).toFixed(2)).toString() + " m"
            } else {
                time = mistiming.toString() + " s"
            }
            return time;
        }
    });
