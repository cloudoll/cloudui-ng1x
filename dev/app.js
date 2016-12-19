'use strict';


// define([
//     'angular',
//     'common/common.module',
//     'common/services',
//     "controller/account/login",
//     "controller/account/account.module",
//     "controller/user/user_list",
//     "controller/user/user.module"
// ], function () {

// var common = require('./common/common.module');
// var account = require('./controller/account/account.module');
// var user = require('./controller/user/user.module');

require('./common/main');
require('./controller/account/main');
require('./controller/user/main');

var app = angular.module('app',
        [
            'ui.router',
            'ngDialog',
            'angular-toasty',
            'ng-sweet-alert',
            'ngCookies',
            'app.common',
            'app.account',
            'app.user'
        ]
    );

module.exports = app;

// });

//
// toasty.success({
//     title: 'User added!',
//     msg: user.firstName + ' has been added!'
// });
// toasty(); // Default
// toasty.info();
// toasty.success();
// toasty.wait();
// toasty.error();
// toasty.warning();
// toasty('Quick Toast!');
// toasty.success('Quick Success Toast!');
//
// SweetAlert.confirm("Are you sure?", {title : "Careful now!"})
//     .then(function(p) { do something on success },
//         function(p) { do something on fail }
//     );
//
// SweetAlert.success("You have successfully completed our poll!", {title: "Good job!"});