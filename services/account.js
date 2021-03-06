var db      = require('cloudoll').orm.mongo;
var tools   = require('common-tools');
var errors  = require('cloudoll').errors;
var myTools = require('../tools');


module.exports = {
    register              : function *(regInfo0) {
        var regInfo      = {};
        regInfo.mobile   = regInfo0.mobile;
        regInfo.email    = regInfo0.email;
        regInfo.nick     = regInfo0.nick;
        regInfo.password = regInfo0.password;

        if (regInfo.mobile == '') {
            delete regInfo.mobile;
        }
        if (regInfo.email == '') {
            delete regInfo.email;
        }
        if (regInfo.nick == '') {
            delete regInfo.nick;
        }
        if (!regInfo.mobile && !regInfo.nick && !regInfo.email) {
            throw errors.WHAT_REQUIRE('手机，email或昵称');
        }

        if (regInfo.mobile && !tools.validateTools.isChinaMobile(regInfo.mobile)) {
            throw errors.CHINA_MOBILE_ILLEGAL;
        }
        if (regInfo.email && !tools.validateTools.isEmail(regInfo.email)) {
            throw errors.EMAIL_ILLEGAL;
        }
        if (regInfo.nick && (regInfo.nick.length < 3 || regInfo.length > 30)) {
            throw errors.WHAT_WRONG_LENGTH_RANGE('昵称', 3, 30);
        }
        if (regInfo.mobile) {
            var existMobile = yield db.findOne("account", {
                mobile: regInfo.mobile
            });
            console.log(existMobile);
            if (existMobile) {
                throw errors.WHAT_EXISTED("手机");
            }
        }
        if (regInfo.email) {
            var existEmail = yield db.findOne("account", {
               email: regInfo.email
            });
            if (existNick) {
                throw errors.WHAT_EXISTED("邮箱");
            }
        }
        if (regInfo.nick) {
            var existNick = yield db.findOne("account", {
               nick: regInfo.nick
            });
            if (existNick && existNick.nick) {
                throw errors.WHAT_EXISTED("昵称");
            }

        }

        regInfo.open_id = tools.stringTools.uuid(true);

        if (!regInfo.password) {
            regInfo.password = tools.stringTools.randomString(18);
        }

        var newPassword  = tools.stringTools.genPassword(regInfo.password);
        regInfo.password = newPassword.password;
        regInfo.salt     = newPassword.salt;

        var xid = yield db.insert('account', regInfo, ['id', 'open_id']);

        delete regInfo.salt;
        delete regInfo.password;
        regInfo.id      = xid.id;
        regInfo.open_id = xid.open_id;
        //logger.info("regInfo",regInfo);
        return regInfo;
    },
    loadByPassport        : function *(passport) {
        var where = {nick:passport};
        if (tools.validateTools.isEmail(passport)) {
            {email:passport};
        } else if (tools.validateTools.isChinaMobile(passport)) {
            {mobile:passport};
        }

        return yield db.findOne("account", where);
    },
    loadById              : function *(id) {
        return yield db.findOne("account", {
          id: id
        });
    },
    loginByPassport       : function *(passport, password) {
        if (!passport) {
            throw errors.WHAT_REQUIRE("帐号");
        }
        if (!password) {
            throw errors.WHAT_REQUIRE("密码");
        }
        var mine = yield this.loadByPassport(passport);
        if (!mine) {
            throw errors.LOGIN_ERROR_BECAUSE('用户没找到，请重新输入登录凭证。');
        }

        var cptPassword = tools.stringTools.computePassword(password, mine.salt);

        if (cptPassword !== mine.password) {
            throw errors.LOGIN_ERROR;
        }
        delete mine.password;
        delete mine.salt;
        return mine;

    },
    checkPassportAvailable: function *(passport) {
        var mine = yield this.loadByPassport(passport);
        if (mine) {
            throw errors.WHAT_EXISTED(passport);
        }
        return true;
    },

    getAllByTicket   : function *(ticket) {
        if (!ticket) {
            throw errors.WHAT_REQUIRE("ticket");
        }
        var openId = myTools.getOpenId(ticket);

        var userInfo = yield db.findOne("account", {open_id:openId});
        //     {
        //     where : "open_id=$openId",
        //     cols  : ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
        //     params: {openId: openId}
        // });

        if(userInfo){
            delete userInfo.password ;
            delete userInfo.salt ;
            var devices = yield db.take("device", { account_id:userInfo.id});

            //
            //     where : "account_id=$account_id",
            //     params: {account_id: userInfo.id},
            //     cols  : ["title", "sn", "mac", "code"]
            // });

            userInfo.devices = devices;
            return userInfo;
        }

        return null;

    },
    getInfoByTicket  : function *(ticket) {
        if (!ticket) {
            throw errors.WHAT_REQUIRE("ticket");
        }
        var openId = myTools.getOpenId(ticket);

        var data = yield db.findOne("account", {open_id:openId});

        //     where : "open_id=$openId",
        //     cols  : ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
        //     params: {openId: openId}
        // });

        if (!data) {
            throw errors.WHAT_NOT_EXISTS('用户');
        }
        return data;
    },
    getRightsByTicket: function *(ticket, service_code) {
        if (!ticket) {
            throw errors.WHAT_REQUIRE("ticket");
        }

        var openId   = myTools.getOpenId(ticket);
        var userInfo = yield db.findOne("account", {open_id:openId});

        //
        //     where : "open_id=$openId",
        //     cols  : ["id", "open_id", "youku_id", "nick", "email", "mobile", "account_type"],
        //     params: {openId: openId}
        // });


        var uAType = 0 || parseInt(userInfo.account_type);
        if ((uAType & 8) == 8) {
            userInfo.rights = [{
                "id"   : "0",
                "title": "上帝管理员",
                "code" : "GOD_ADMIN"
            }];
            delete userInfo.password;
            delete userInfo.salt;
            return userInfo;
        }


        if (!service_code) {
            throw errors.WHAT_REQUIRE("service");
        }

        var xservice = yield db.findOne("service", {code:service_code});
        //
        //     where : "code=$code",
        //     params: {code: service_code},
        //     cols  : ["id", "title", "code"]
        // });


        if (xservice == null) {
            throw errors.WHAT_NOT_FOUND("服务 [" + service_code + "] ");
        }

        userInfo.rights = yield db.take("v_user_rights", {account_id:account_id,service_id:xservice.id});
        //     where : "account_id=$account_id and service_id=$sid",
        //     params: {account_id: userInfo.id, sid: xservice.id},
        //     cols  : ["id", "title", "code"]
        // });

        return userInfo;
    },

    getDevicesByTicket: function *(ticket) {
        if (!ticket)
            throw errors.WHAT_REQUIRE("ticket");
        var openId = myTools.getOpenId(ticket);

        var userInfo = yield db.findOne("account", {
            where : "open_id=$openId",
            cols  : ["id", "youku_id", "nick", "email", "mobile"],
            params: {openId: openId}
        });

        userInfo.devices = yield db.take("device", {
            where : "account_id=$aid",
            params: {aid: userInfo.id},
            cols  : ["title", "sn", "mac", "code"]
        });

        return userInfo;

    },
    adminList         : function *(qs) {

        var skip  = qs.skip || 0;
        var limit = qs.limit || 20;

        var where = {}, queryParams = {};

        var qkey = qs.q;
        //
        // var qmb = qs.mobile;
        // var eml = qs.email;
        // var nk  = qs.nick;

        if (qkey) {
            where += " and ((mobile like $qkey) or (email like $qkey) or (nick like $qkey))";
            queryParams.qkey = '%' + qkey + '%';
        }

        return yield db.list("account", where,{skip:skip,limit:limit,sort:{id:-1}});

        //     where  : where,
        //     params : queryParams,
        //     orderBy: "id desc",
        //     skip   : skip,
        //     limit  : limit,
        //     cols   : ['id', 'mobile', 'email', 'nick', 'open_id', 'avatar', 'account_type']
        // });

    },
    grantGod          : function *(accountId) {
        if (!accountId) {
            throw errors.WHAT_REQUIRE('id');
        }
        accountId      = parseInt(accountId);
        var me         = yield db.loadById("account", accountId, ['id', 'account_type']);
        var updateData = {id: accountId};

        if ((me.account_type & 8) == 8) {
            updateData.account_type = updateData.account_type & ~8;
        } else {
            updateData.account_type = updateData.account_type | 8;
        }
        yield db.update('account', updateData);
        return true;

    },
    update            : function *(regInfo) {
        if (regInfo.mobile == '') {
            delete regInfo.mobile;
        }
        if (regInfo.email == '') {
            delete regInfo.email;
        }
        if (regInfo.nick == '') {
            delete regInfo.nick;
        }
        if (!regInfo.mobile && !regInfo.nick && !regInfo.email) {
            throw errors.WHAT_REQUIRE('手机，email或昵称');
        }

        if (regInfo.mobile) {
            if (!tools.validateTools.isChinaMobile(regInfo.mobile)) {
                throw errors.CHINA_MOBILE_ILLEGAL;
            }
        }
        if (regInfo.email) {
            if (!tools.validateTools.isEmail(regInfo.email)) {
                throw errors.EMAIL_ILLEGAL;
            }
        }
        if (regInfo.nick) {
            if (regInfo.nick.length < 3 || regInfo.length > 30) {
                throw errors.WHAT_WRONG_LENGTH_RANGE('昵称', 3, 30);
            }
        }

        if (regInfo.password && regInfo.password != "") {
            var newPassword  = tools.stringTools.genPassword(regInfo.password);
            regInfo.password = newPassword.password;
            regInfo.salt     = newPassword.salt;
        } else {
            delete regInfo.password;
        }

        delete regInfo.open_id;
        delete regInfo.account_type;
        delete regInfo.avatar;

        if (!regInfo.id) {
            delete regInfo.id;
        }


        var xid = yield db.save('account', regInfo, ['id', 'open_id']);

        delete regInfo.salt;
        delete regInfo.password;
        regInfo.id = xid.id;

        return regInfo;


    }
};