angular.module('ethExplorer')
    .controller('nodeExplorerCtrl', function ($rootScope, $scope, localweb3) {
        $scope.bootnodeipinfos = []
        $scope.staticnodeipinfos = []
        var bootnode = [{ a: "52.16.188.185", e:"enode://a979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c" },
        { a: "13.93.211.84", e:"enode://3f1d12044546b76342d59d4a05532c14b85aa669704bfe1f864fe079415aa2c02d743e03218e57a33fb94523adb54032871a6c51b2cc5514cb7c7e35b3ed0a99"},
        { a: "191.235.84.50", e:"enode://78de8a0916848093c73790ead81d1928bec737d565119932b98c6b100d944b7a95e94f847f689fc723399d2e31129d182f7ef3863f2b4c820abbf3ab2722344d"},
        { a: "13.75.154.138", e:"enode://158f8aab45f6d19c6cbf4a089c2670541a8da11978a2f90dbf6a502a4a3bab80d288afdbeb7ec0ef6d92de563767f3b1ea9e8e334ca711e9f8e2df5a0385e8e6" },
        { a: "52.74.57.123", e:"enode://1118980bf48b0a3640bdba04e0fe78b1add18e1cd99bf22d53daac1fd9972ad650df52176e7c7d89d1114cfef2bc23a2959aa54998a46afcf7d91809f0855082" },
        { a: "5.1.83.226", e:"enode://979b7fa28feeb35a4741660a16076f1943202cb72b6af70d327f053e248bab9ba81760f39d0701ef1d8f89cc1fbd2cacba0710a12cd5314d5e0c9021aa3637f9" }
        ];
        angular.forEach(bootnode, function (data, index, array) {
            addNewNodeInfo($scope.bootnodeipinfos, data.a, data.e)
        });
        $scope.versions = localweb3.getVersions($rootScope.web3)

        function addNewNodeInfo(ipinfos, ip, info) {
            var url = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=" + ip;

            $.getScript(url, function (_result) {
                if (remote_ip_info.ret == '1') {
                    var ipInfo = {
                        ip: ip,
                        country: remote_ip_info.country,
                        province: remote_ip_info.province,
                        city: remote_ip_info.city,
                        district: remote_ip_info.district,
                        info: info
                    }
                    $scope.$apply(
                        ipinfos.push(ipInfo)
                    )
                } else {
                    alert('没有找到匹配的IP地址信息！');
                }

            });
        }
    });
