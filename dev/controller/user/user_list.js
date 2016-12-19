// define(
//     [
//         'angular',
//         "controller/user/user.module"
//     ],
//     function (angular) {

var user = require('./user.module');
//var user_edit_template = require('./user_edit.ejs');
user.controller('UserListCtrl', [
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
            UserSrv.getUserList().then(function (res) {
                if(res.data.errno!==undefined){
                    SweetAlert.alert(res.data.errText,{title: "提示"});
                }else{
                    $scope.pagelist = res.data;
                }
            }, function (error) {

            });
        };

        $scope.fnEdit = function (item) {
            $scope.formdata = item;
            //var template =  'controller/user/user_edit.ejs';// require('./user_edit.ejs');
            $scope.dialog = ngDialog.open({
                template: require('./user_edit.ejs'),
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

        $scope.cancelEdit = function () {
            $scope.dialog.close();
        };

        $scope.saveData = function () {

        };

        $scope.loadData();
    }]);

// });