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
                    template: require('./user/user_list.html'),
                    controller: 'UserListCtrl'
                }
            }
        })
        .state('main.roleList', {
            url: '/admin/role_list',
            views: {
                'mainContent': {
                    template: require('./role/role_list.html'),
                    controller: 'RoleListCtrl'
                }
            }
        })
        .state('main.serviceList', {
            url: '/admin/service_list',
            views: {
                'mainContent': {
                    template: require('./service/service_list.html'),
                    controller: 'ServiceListCtrl'
                }
            }
        })
        .state('main.rightList', {
            url: '/admin/right_list',
            views: {
                'mainContent': {
                    template: require('./right/right_list.html'),
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
            return $data.get("/admin/account/list", data);
        },
        saveUserData: function (obj) {
            var data = {
                mobile: obj.mobile,
                email: obj.email,
                nick: obj.nick,
                id: obj.id
            };
            return $data.post("/admin/account/save", data);
        },
        getRoleList: function (data) {
            var data = data || {};
            return $data.get("/admin/role/list", data);
        },
        saveRoleData: function (obj) {
            var data = {
                title: obj.title
            };
            if(obj.id !== undefined){
                data.id = obj.id;
            }
            return $data.post("/admin/role/save", data);
        },
        getServiceList:function () {
            var data = data || {};
            return $data.get("/admin/right/list-service", data);
        },
        syncService:function () {
            var data = data || {};
            return $data.get("/admin/right/sync-from-cloudeer", data);
        },
        getRightList:function (data) {
            var data = data || {};
            return $data.get( "/admin/right/list-rights", data);
        }
    };
}]);

module.exports = user;

// );


