/**
 * Created by Peter on 2016/12/15.
 */
'use strict';

// define([
//     'angular',
//     'app'
// ], function () {

var app = require('./app');
var appConfig = require('./app.constants');

app.run([
    '$rootScope',
    '$state',
    'SweetAlert',
    'toasty',
    '$cookies',
    '$stateParams',
    function ($rootScope,
              $state,
              SweetAlert,
              toasty,
              $cookies,
              $stateParams) {


        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.config = appConfig;
        
        $rootScope.ticket = $cookies.get("ticket");
        $rootScope.nick = $cookies.get("nick");

        $rootScope.alert = function (msg) {
            SweetAlert.alert(msg);
        };
        
        $rootScope.confirm = function (msg,fn1,fn2) {
            SweetAlert.confirm(msg,
                {
                    title: "提示",
                    confirmButtonText: "确 定",
                    cancelButtonText: "取 消",
                    imageUrl: null
                })
                .then(function (confirm) {
                    if(confirm==true){
                        fn1();
                    }else{
                        fn2();
                    }
                });
        };
        
        $rootScope.toast = function (msg) {
            toasty(msg);
        };

        $rootScope.setUserInfo = function (data) {
            var expires_in = data.expires_in;
            var expireDate = new Date(expires_in * 1000);
            $cookies.put("ticket",data.ticket,{'expires':expireDate});
            $cookies.put("nick",data.nick,{'expires':expireDate});
            $rootScope.ticket = data.ticket;
        };
        
        //var openView = ["login", "register", "userAgreement", "forgetPassword", "loading"];
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            if (appConfig.openView.indexOf(toState.name) >= 0) {

            } else if (appConfig.openView.indexOf(toState.name) < 0 && (!$rootScope.ticket || $rootScope.ticket.length <=0)) {
                $state.go("login");
                event.preventDefault();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //$rootScope.$broadcast('to-child', 'child');
        });
    }]
);

// });
