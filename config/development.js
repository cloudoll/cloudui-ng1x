module.exports = {
    debug: true,
    app_name: "cloudui",
    port: 8002,
    //controller_dirs: ['/api/open'],
    koa_middles_forbidden: {
        json_validator: true,
        authenticate: true,
        clouderr_handle: false
    },
    mongo: {
        dburl:"mongodb://127.0.0.1:27017/cloudui"
    },
    account: {
        expire_in : 7200, //默认过期时间 24 小时,
    }
    
    // postgres             : {
    //     conString: "postgres://postgres:docker_youku@112.74.29.211:5432/zhanxp"
    // },
    // mysql   : {
    //   //mysql host 在我的 fedora 23 里面的 docker 里。
    //   connectionLimit: 10,
    //   host           : '10.211.55.15',
    //   user           : 'root',
    //   password       : 'zhwell',
    //   database       : 'cloudarling'
    // },
    // cloudeer: {
    //     type: 'rest', //可选 rest, tcp, zoo
    //     host: '127.0.0.1',
    //     port: 8801,
    //     not_a_consumer: false,
    //     not_a_service: true,
    //     no_methods_register: true,
    //     username: 'youku',
    //     password: 'youku123'
    // }
};
