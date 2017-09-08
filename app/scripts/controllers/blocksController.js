angular.module('ethExplorer')
    .controller('blocksCtrl', function ($rootScope, $scope, $location, localStorage) {

        var web3 = $rootScope.web3;
        var maxBlocks = 50; // TODO: into setting file or user select
        var pageNum = localStorage.getLocalStorage("pageNum", 0);
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10);
        if (maxBlocks > blockNum) {
            maxBlocks = blockNum + 1;
        }

        var peers = $scope.peers = parseInt(web3.net.peerCount, 10);

        // get latest 50 blocks
        $scope.blocks = [];
        for (var i = 0; i < maxBlocks; ++i) {
            number = blockNum - i - pageNum * maxBlocks;
            if (number < 0) {
                number = 0;
            }
            $scope.blocks.push(web3.eth.getBlock(number));
            if (number == 0) {
                break;
            }
        }

        // $scope.processRequest = function () {
        //     var requestStr = $scope.ethRequest.split('0x').join('');

        //     if (requestStr.length === 40)
        //         return goToAddrInfos(requestStr)
        //     else if (requestStr.length === 64) {
        //         if (/[0-9a-zA-Z]{64}?/.test(requestStr))
        //             return goToTxInfos('0x' + requestStr)
        //         else if (/[0-9]{1,7}?/.test(requestStr))
        //             return goToBlockInfos(requestStr)
        //     } else if (parseInt(requestStr) > 0)
        //         return goToBlockInfos(parseInt(requestStr))

        //     alert('Don\'t know how to handle ' + requestStr)
        // };


        // function goToBlockInfos(requestStr) {
        //     $location.path('/block/' + requestStr);
        // }

        // function goToAddrInfos(requestStr) {
        //     $location.path('/address/' + requestStr);
        // }

        // function goToTxInfos(requestStr) {
        //     $location.path('/transaction/' + requestStr);
        // }

        $scope.firstBlocks = function () {
            pageNum = 0;
            localStorage.setLocalStorage("pageNum", pageNum);
            window.location.reload();
        };
        $scope.peviousBlocks = function () {
            pageNum--;
            if (pageNum < 0) {
                pageNum = 0;
            }
            localStorage.setLocalStorage("pageNum", pageNum);
            window.location.reload();
        };
        $scope.nextBlocks = function () {
            pageNum++;
            if (pageNum > blockNum / maxBlocks + 1) {
                return;
            }
            localStorage.setLocalStorage("pageNum", pageNum);
            window.location.reload();
        };
        $scope.lastBlocks = function () {
            pageNum = blockNum / maxBlocks;
            localStorage.setLocalStorage("pageNum", pageNum);
            window.location.reload();
        };
    });
