/**
 * Created by Peter on 2016/12/15.
 */
'use strict';

// define(
//     [
//         'angular',
//         'common/common.module'
//     ],
//     function (angular) {

var account = angular.module('app.account', []);

account.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            template: require('./login/login.html'),
            //templateUrl: 'controller/account/login.ejs',
            controller: 'LoginCtrl'
        })
        .state('register', {
            url: '/register',
            template: require('./register/register.html'),
            controller: 'RegisterCtrl'
        })
}]);

account.service('AccountSrv', ['$rootScope', '$data', function ($rootScope, $data) {
    return {
        login: function (obj) {
            var data = {
                passport: obj.passport,
                password: obj.password
            };

            if (obj.remember == true) {
                var now = new Date() * 1;
                data.expires_in = (now / 1000) + 60 * 60 * 24 * 14;
            }

            // var url = "open/account/login";
            // return $data.post(url,data);
            //postCloudeer
            return $data.post( "/open/account/login", data);
        },
        loadUserInfo: function () {
            return $data.get( "/open/account/info", {ticket:$rootScope.ticket});
        },
        register:function (obj) {
            var data = {
                passport:obj.passport,
                email:obj.email,
                nick:obj.nick,
                password:obj.password
            };
            if (obj.remember == true) {
                var now = new Date() * 1;
                data.expires_in = (now / 1000) + 60 * 60 * 24 * 14;
            }
            return $data.post( "/open/account/register", data);
        }
    };
}]);

module.exports = account;

//}
// );


