/**
 * Created by Peter on 2016/12/16.
 */
// define(
//     [
//         'angular'
//     ],
//     function (angular) {


var user = angular.module('app.admin', []);

user.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('main.userList', {
            url: '/admin/user_list',
            views: {
                'mainContent': {
                    //templateUrl: 'controller/user/user_list.ejs',
                    template: require('./user_list.ejs'),
                    controller: 'UserListCtrl'
                }
            }
        })
        .state('main.roleList', {
            url: '/admin/role_list',
            views: {
                'mainContent': {
                    template: require('./role_list.ejs'),
                    controller: 'RoleListCtrl'
                }
            }
        })
        .state('main.serviceList', {
            url: '/admin/service_list',
            views: {
                'mainContent': {
                    template: require('./service_list.ejs'),
                    controller: 'ServiceListCtrl'
                }
            }
        })
        .state('main.rightList', {
            url: '/admin/right_list',
            views: {
                'mainContent': {
                    template: require('./right_list.ejs'),
                    controller: 'RightListCtrl'
                }
            }
        })
}]);

user.service('AdminSrv', ['$rootScope', '$data', function ($rootScope, $data) {
    return {
        getUserList: function (data) {
            // var url = "open/user/list";
            // var data = {};
            // return $data.get(url, data);
            var data = data || {};
            return $data.getCloudeer("cloudarling", "/admin/account/list", data);
        },
        saveUserData: function (obj) {
            var data = {
                mobile: obj.mobile,
                email: obj.email,
                nick: obj.nick,
                id: obj.id
            };
            return $data.postCloudeer("cloudarling", "/admin/account/save", data);
        },
        getRoleList: function (data) {
            var data = data || {};
            return $data.getCloudeer("cloudarling", "/admin/role/list", data);
        },
        saveRoleData: function (obj) {
            var data = {
                title: obj.title
            };
            if(obj.id !== undefined){
                data.id = obj.id;
            }
            return $data.postCloudeer("cloudarling", "/admin/role/save", data);
        },
        getServiceList:function () {
            var data = data || {};
            return $data.getCloudeer("cloudarling", "/admin/right/list-service", data);
        },
        syncService:function () {
            var data = data || {};
            return $data.getCloudeer("cloudarling", "/admin/right/sync-from-cloudeer", data);
        },
        getRightList:function (data) {
            var data = data || {};
            return $data.getCloudeer("cloudarling", "/admin/right/list-rights", data);
        }
    };
}]);

module.exports = user;

// );


