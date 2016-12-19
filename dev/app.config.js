/**
 * Created by Peter on 2016/12/15.
 */
'use strict';

// define([
//     'angular',
//     'app',
//     'controller/main/mainMenuCtrl'
// ], function () {

var app = require('./app');
var appConfig = require('./app.constants');

require('./controller/main/mainMenuCtrl');
require('./app.http.interceptor');

app.config([
    '$httpProvider',
    '$urlRouterProvider',
    '$stateProvider',
    'toastyConfigProvider',
    '$locationProvider',
    function ($httpProvider,
              $urlRouterProvider,
              $stateProvider,
              toastyConfigProvider,
              $locationProvider) {


        toastyConfigProvider.setConfig({
            sound: false,
            shake: false,
            position:'top-right' //{string:bottom-right,bottom-left,top-right,top-left,top-center,bottom-center}
        });

        $httpProvider.interceptors.push('app.httpInterceptor');

        //$locationProvider.html5Mode({enable: true, requireBase: false});

        $stateProvider.state('main', {
            abstract: true,
            template: require('controller/main/mainMenu.ejs'),
            controller: 'MainMenuCtrl'
        });
        
        $urlRouterProvider.otherwise(appConfig.homeview.url);

    }]);

// });



