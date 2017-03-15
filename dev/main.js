/**
 * Created by Peter on 2016/12/15.
 */
require.config({
    paths: {
        //库文件
        //"common-css": "css/common.css",
    },
    shim: {
        // angular: {
        //     exports: "angular"
        // },
        // angularRoute: {
        //     deps: ["angular"]
        // },
        // angularResource: {
        //     deps: ['angular']
        // }
    },
    urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用  
});

//require('vender');
//require('angular');

require("css/common.css");
require('./app');
require('./app.config');
require('./app.run');

//手动启动ng  
//define(['app','app.config','app.run'], function () {
    //使用bootstrap方法启动Angular应用  
    angular.bootstrap(document, ["app"]);
//});