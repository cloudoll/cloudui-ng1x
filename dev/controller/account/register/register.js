/**
 * Created by Peter on 2016/12/17.
 */
var account = require('../account.module');
account.controller('RegisterCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'AccountSrv',
    function ($scope,
              $rootScope,
              $state,
              AccountSrv) {

        $scope.formData = {};
        $scope.appInfo = $rootScope.config.appInfo;
        $scope.register = function () {
            if($scope.formData.password!=$scope.formData.passwordReType){
                $rootScope.toast("两次输入的密码不一致");
                return;
            }
            
            AccountSrv.register($scope.formData).then(function (res) {
                var data = res.data;
                if(data.ticket && data.ticket.length > 0){
                    $rootScope.setUserInfo(data);
                    $state.go($rootScope.config.homeview.name);
                }
            },function (error) {

            });
        };
    }]);