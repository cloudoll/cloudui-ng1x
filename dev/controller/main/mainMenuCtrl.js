/**
 * Created by Peter on 2016/12/15.
 */

'use strict';

// define([
//     'angular',
//     'app'
// ], function () {

var app = require('../../app');
var account = require('../account/account.module');
app.controller('MainMenuCtrl', [
    '$rootScope',
    '$scope',
    'SweetAlert',
    '$state',
    'AccountSrv',
    function ($rootScope,
              $scope,
              SweetAlert,
              $state,
              AccountSrv) {

        $scope.userinfo = {nick:$rootScope.nick};
        $scope.loadUserInfo = function () {
            AccountSrv.loadUserInfo().then(
                function (res) {
                    $scope.userinfo = res.data;
                }, function (error) {

                }
            );
        };

        $scope.logout = function () {
            SweetAlert.confirm("确定要退出吗?",
                {
                    title: "提示",
                    confirmButtonText: "确 定",
                    cancelButtonText: "取 消",
                    //html: true,
                    imageUrl: null
                })
                .then(function (confirm) {
                        if (confirm == true) {
                            $rootScope.ticket = null;
                            $state.go($rootScope.config.loginview.name);
                        } else {

                        }
                    }
                );
        };

        $scope.loadUserInfo();
    }]);

// });
   



