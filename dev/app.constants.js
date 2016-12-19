var appConfig = {
    debug:true,
    appInfo:{
        name:'Cloud',
        shortName:'UI'
    },
    homeview: {
        name: "main.userList",
        url: "/admin/user_list"
    },
    loginview:{
        name:"login",
        url:"/login"
    },
    openView: ["login", "register", "userAgreement", "forgetPassword", "loading"]
};

module.exports = appConfig;