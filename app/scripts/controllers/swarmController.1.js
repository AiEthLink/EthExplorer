angular.module('ethExplorer')
    .controller('swarmCtrl', function ($rootScope, $scope) {
        var web3 = $rootScope.web3;

        $scope.processRequest = function () {
            var requestStr = $scope.ethRequest.split('0x').join('');
            console.log('processRequest:' + requestStr)
            
            // web3.bzz.put(requestStr, "Content-Type: text/plain", function (error, result) {
            //     console.log('web3.bzz.put error:' + error)
            //     console.log('web3.bzz.put result:' + result)
            // })
            web3.bzz.get("79f943162cd6b44769998321d2ceedd9596fdbc018b294eec78b3b47a5cdaf77", function (error, result) {
                console.log('web3.bzz.get error:' + error)
                console.log('web3.bzz.get result:' + result)
            })
        }
    });
