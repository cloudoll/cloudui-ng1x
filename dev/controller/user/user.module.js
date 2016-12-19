/**
 * Created by Peter on 2016/12/16.
 */
// define(
//     [
//         'angular'
//     ],
//     function (angular) {


var user = angular.module('app.user', []);

user.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('main.userList', {
            url: '/user/user_list',
            views: {
                'mainContent': {
                    //templateUrl: 'controller/user/user_list.ejs',
                    template:require('./user_list.ejs'),
                    controller: 'UserListCtrl'
                }
            }
        })
}]);

user.service('UserSrv', ['$rootScope', '$data', function ($rootScope, $data) {
    return {
        getUserList: function (data) {
            // var url = "open/user/list";
            // var data = {};
            // return $data.get(url, data);
            var data = data || {};
            return $data.getCloudeer("cloudarling","/admin/account/list",data);
        }
    };
}]);

module.exports = user;

// );


