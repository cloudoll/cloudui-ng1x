// define(
//     [
//         'angular',
//         "controller/user/user.module"
//     ],
//     function (angular) {

var user = require('../admin.module');
//var user_edit_template = require('./user_edit.ejs');
user.controller('UserListCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'ngDialog',
    'SweetAlert',
    'toasty',
    'AdminSrv',
    function ($scope,
              $rootScope,
              $state,
              ngDialog,
              SweetAlert,
              toasty,
              AdminSrv) {

        $scope.pagelist = {};
        $scope.formdata = {};
        $scope.loadData = function () {
            AdminSrv.getUserList().then(function (res) {
                if(res.success){
                    $scope.pagelist = res.data;
                }
            },function (error) {

            });
        };

        $scope.fnShowFrom = function (item) {
            $scope.formdata = angular.copy(item);
            //var template =  'controller/user/user_edit.ejs';// require('./user_edit.ejs');
            $scope.dialog = ngDialog.open({
                template: require('./user_edit.html'),
                plain:true,
                className: 'ngdialog-theme-default editform_dialog',
                scope: $scope
            });

        };

        $scope.fnDelete = function (item) {

            // toasty.success({
            //     title: 'User added!',
            //     msg: user.firstName + ' has been added!'
            // });
            // return;

            //SweetAlert.success("You have successfully completed our poll!", {title: "Good job!"});
            SweetAlert.confirm("确定要删除吗?",
                {
                    title: "提示",
                    confirmButtonText: "确 定",
                    cancelButtonText: "取 消",
                    //html: true,
                    imageUrl: null
                })
                .then(function (confirm) {
                        if (confirm == true) {
                            toasty.success('删除成功!');
                        } else {

                        }
                    }
                );
        };

        $scope.fnHideForm = function () {
            $scope.dialog.close();
        };

        $scope.saveData = function () {
            AdminSrv.saveUserData($scope.formdata).then(function (res) {
                if(res.data.success){
                    $scope.fnHideForm();
                    $scope.loadData();
                }
            },function (error) {
                
            });
        };
        
        $scope.loadData();

    }]);

// });