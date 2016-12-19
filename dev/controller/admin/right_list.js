/**
 * Created by Peter on 2016/12/19.
 */

var user = require('./admin.module');
user.controller('RightListCtrl', [
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
            AdminSrv.getRightList().then(function (res) {
                if(res.data.success){
                    $scope.pagelist = res.data;
                }
            }, function (error) {

            });
        };

        $scope.fnShowFrom = function (item) {
            if(item!==undefined){
                $scope.formdata = angular.copy(item);
                $scope.formdata.formTilte = "修改权限";
            }else{
                $scope.formdata = {};
                $scope.formdata.formTilte = "添加权限";
            }
            //var template =  'controller/user/user_edit.ejs';// require('./user_edit.ejs');
            $scope.dialog = ngDialog.open({
                template: require('./right_edit.ejs'),
                plain:true,
                className: 'ngdialog-theme-default editform_dialog',
                scope: $scope
            });

        };

        $scope.fnDelete = function (item) {

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
            AdminSrv.saveRoleData($scope.formdata).then(function (res) {
                if(res.data.success){
                    $scope.fnHideForm();
                    $scope.loadData();
                }
            },function (error) {

            });
        };

        $scope.fnSyncData = function () {
            AdminSrv.syncService().then(function (res) {
                if(res.data.success) {
                    $scope.loadData();
                }
            },function (error) {

            });
        };

        $scope.loadData();
    }]);