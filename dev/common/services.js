// define(
//     [
//         'angular',
//         'common/common.module'
//     ],
//     function (angular) {

var common = require('./common.module');
common.factory('$data', ['$http','$rootScope', function ($http,$rootScope) {
    return {
        header: function () {
            var ticket = $rootScope.ticket || "";
            var _headers = {
                "ticket": ticket,
                //'Authorization': 'Basic ' + _authdata,c c
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            };
            return _headers;
        },
        post: function (url, data) {
            var header = this.header();
            return $http({
                method: 'POST',
                url: url,
                responseType: "json",
                headers: header,
                data: data,
                timeout: 5000
            });
        },
        delete: function (url, data) {
            var header = this.header();
            return $http({
                method: 'DELETE',
                url: url,
                responseType: "json",
                headers: header,
                data: data,
                timeout: 5000
            });
        },
        get: function (url, data,_success,_error,_finally) {
            var header = this.header();
            return $http({
                method: 'GET',
                url: url,
                responseType: "json",
                headers: header,
                data: data,
                params: data,
                timeout: 5000
            });
        },
        uuid: function () {
            var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return str.replace("-", "");
        },
        getCloudeer: function (service, url, params) {
            var ticket = $rootScope.ticket || "";
            params.ticket = ticket;
            return this.post('/cloudeer/get', {
                service: service,
                url: url,
                params: params
            });
        },
        postCloudeer: function (service, url, params) {
            var ticket = $rootScope.ticket || "";
            url = url+"?ticket=" + encodeURI(ticket);
            return this.post('/cloudeer/post', {
                service: service,
                url: url,
                params: params
            });
        }
    };
}]);

// });