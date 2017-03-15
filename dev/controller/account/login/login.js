// define(
//     [
//         'angular',
//         "controller/account/account.module"
//     ],
//     function (angular) {

var account = require('../account.module');
account.controller('LoginCtrl', [
    '$scope',
    '$rootScope',
    '$cookies',
    '$state',
    '$cookieStore',
    'AccountSrv',
    function ($scope,
              $rootScope,
              $cookies,
              $state,
              $cookieStore,
              AccountSrv) {

        $scope.formData = {};
        $scope.appInfo = $rootScope.config.appInfo;
        $scope.login = function () {
            AccountSrv.login($scope.formData).then(function (res) {
                var data = res.data;
                console.log(res.data);
                if(data.ticket && data.ticket.length > 0){
                    $rootScope.setUserInfo(data);
                    $state.go($rootScope.config.homeview.name);
                }
            },function (error) {
                
            });
        };
    }]);

// });