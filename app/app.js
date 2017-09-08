'use strict';

angular.module('ethExplorer', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', 
        function ($routeProvider) {
            $routeProvider.
                when('/home', {
                    templateUrl: 'views/main.html',
                    controller: 'mainCtrl'
                }).
                when('/blocks', {
                    templateUrl: 'views/blocks.html',
                    controller: 'blocksCtrl'
                }).
                when('/block/:blockId', {
                    templateUrl: 'views/blockInfos.html',
                    controller: 'blockInfosCtrl'
                }).
                when('/allTransactions', {
                    templateUrl: 'views/allTransactions.html',
                    controller: 'allTransactionsCtrl'
                }).
                when('/accounts/:accountType', {
                    templateUrl: 'views/accounts.html',
                    controller: 'accountsCtrl'
                }).
                when('/transaction/:transactionId', {
                    templateUrl: 'views/transactionInfos.html',
                    controller: 'transactionInfosCtrl'
                }).
                when('/address/:addressId', {
                    templateUrl: 'views/addressInfo.html',
                    controller: 'addressInfoCtrl'
                }).
                when('/nodeexplorer', {
                    templateUrl: 'views/nodeExplorer.html',
                    controller: 'nodeExplorerCtrl'
                }).
                when('/swarm', {
                    templateUrl: 'views/swarm.html',
                    controller: 'swarmCtrl'
                }).
                when('/whisper', {
                    templateUrl: 'views/whisper.html',
                    controller: 'whisperCtrl'
                }).
                when('/contracts/:contractType', {
                    templateUrl: 'views/contracts.html',
                    controller: 'contractsCtrl'
                }).
                when('/tokens/:addressId', {
                    templateUrl: 'views/tokenInfo.html',
                    controller: 'tokenInfoCtrl'
                }).
                when('/simplecontracts/:addressId', {
                    templateUrl: 'views/simpleContractsInfo.html',
                    controller: 'simpleContractsInfoCtrl'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }])
    .run(function ($rootScope) {
        var web3 = new Web3();
        var eth_node_url = 'http://localhost:8545'; // 'http://192.168.20.44:8080'; //
        web3.setProvider(new web3.providers.HttpProvider(eth_node_url));
        $rootScope.web3 = web3;
        function sleepFor(sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
        }
        var connected = false;
        if (!web3.isConnected()) {
            $('#connectwarning').modal({ keyboard: false, backdrop: 'static' })
            $('#connectwarning').modal('show')
        }
    });
