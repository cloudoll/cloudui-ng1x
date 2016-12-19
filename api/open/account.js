/**
 * Created by Peter on 2016/12/17.
 */
module.exports = {
    $login: function *() {

        // var re = {
        //     "errno": 0,
        //     "data": {
        //         "ticket": "eyJvcGVuX2l...",
        //         "expires_in": 1440655749,
        //         "nick": "啤酒云"
        //     }
        // };


        var form     = this.request.body;
        var passport = form.passport;
        var password = form.password;

        var data = {
            passport:passport,
            password:password
        };
        var res = yield this.postCloudeer("cloudarling", "/open/account/login",data);

        //this.body = re;
        this.body = res;
    }
};