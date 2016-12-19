/**
 * Created by Peter on 2016/12/19.
 */
var app = require('./app');
var appConfig = require('./app.constants');

app.factory('app.httpInterceptor', [
    '$q',
    '$rootScope',
    '$log',
    function ($q, $rootScope, $log) {
        return {
            request: function (config) {
                return config;
            },
            response: function (response) {
                if(appConfig.debug===true){
                    $log.info(response);
                }
                
                // if (response.status == 200) {
                //     if (typeof(response.data) == "object") {
                //         var data = response.data;
                //
                //         // if (data.status == 9) {
                //         //     // 用户没用登录
                //         //     $rootScope.$emit("app.httpInterceptor", "notLogin", data);
                //         // }
                //        
                //         response.data = data;
                //     }
                // } else {
                //     $log.info(response);
                // }

                // if (response.config.method == "POST") {
                //     //$rootScope.$emit("app.httpInterceptor", "requestokPost", data);
                // }

                return response;
            }
        };
    }
]);