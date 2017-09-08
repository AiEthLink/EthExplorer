angular.module('ethExplorer')
    .controller('accountsCtrl', function ($rootScope, $scope, $location, $routeParams, $q, localStorage, localweb3) {
        var accountType_Normal = 0;
        var accountType_Contract = 1;
        var accountType = $routeParams.accountType;
        var web3 = $rootScope.web3;

        $scope.accountType = "Normal Accounts";
        if (accountType == accountType_Contract) {
            $scope.accountType = "Contract Accounts";
        } 

        // parse transactions
        $scope.addresses = []

        var transactions = localStorage.getObjectLocalStorage("transactions")

        for (var index = 0; index < transactions.length; index++) {
            var element = transactions[index];

            if (accountType == accountType_Normal && checkAddress(element.from) == false) {
                addNewAddress(element.from, element)
            }

            if (element.to != null && checkAddress(element.to) == false) {
                if (accountType == accountType_Normal 
                    && element.input == '0x') {
                    addNewAddress(element.to, element)
                } else if (accountType == accountType_Contract 
                    && element.value == 0 
                    && element.input != '0x'){
                    addNewAddress(element.to, element)
                }
            }
        }
        $scope.addresscount = $scope.addresses.length;

        function checkAddress(addressHash) {
            for (var index = 0; index < $scope.addresses.length; index++) {
                var element = $scope.addresses[index];

                if (element != null && element.hash == addressHash) {
                    $scope.addresses[index].txcount++;
                    return true;
                }
            }
            return false;
        }

        function addNewAddress(addressHash, transaction) {
            if (addressHash == null) {
                return;
            }

            var address = {
                hash: addressHash,
                balance: 0,
                txcount: 1,
            }
            var deferred = $q.defer();
            localweb3.getAddressInfos(web3, deferred, addressHash).then(function (result) {
                address.balance = result.balanceInEther;
            });

            $scope.addresses.push(address)
        }
    });
