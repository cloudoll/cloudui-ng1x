/**
 * Created by Peter on 2016/12/19.
 */

var user = require('./user.module');
//var user_edit_template = require('./user_edit.ejs');
user.controller('RoleListCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'ngDialog',
    'SweetAlert',
    'toasty',
    'UserSrv',
    function ($scope,
              $rootScope,
              $state,
              ngDialog,
              SweetAlert,
              toasty,
              UserSrv) {

        $scope.pagelist = {};
        $scope.formdata = {};
        $scope.loadData = function () {
            UserSrv.getRoleList().then(function (res) {
                if(res.data.errno!==undefined){
                    SweetAlert.alert(res.data.errText,{title: "提示"});
                }else{
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
                template: require('./role_edit.ejs'),
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
            UserSrv.saveRoleData($scope.formdata).then(function (res) {
                if(res.data.errno!==undefined){
                    SweetAlert.alert(res.data.errText,{title: "提示"});
                }else {
                    $scope.fnHideForm();
                    $scope.loadData();
                }
            },function (error) {

            });
        };

        $scope.loadData();
    }]);