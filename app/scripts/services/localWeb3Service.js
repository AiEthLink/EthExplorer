var myapp = angular.module('ethExplorer');
myapp.service('localweb3', function () {

  this.getVersions = function (web3) {
    //十进制转其他 x.toString(8), x.toString(16)
    //其他转十进制 parseInt(x,8), parseInt(x,16)
    var versions = {
      node: web3.version.node,
      ethereum: parseInt(web3.version.ethereum, 16),
      network: web3.version.network,
      swarm: '',//web3.bzz.info,
      whisper: ''//web3.version.whisper
    }
    return versions;
  }

  this.getAddressInfos = function (web3, deferred, address) {
    web3.eth.getBalance(address, function (error, result) {
      if (!error) {
        deferred.resolve({
          balance: result,
          balanceInEther: web3.fromWei(result, 'ether')
        });
      } else {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }

  this.getTransactionInfos = function(web3, deferred, txid) {
    web3.eth.getTransaction(txid, function (error, result) {
      if (!error) {
        deferred.resolve(result);
      }
      else {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }

});