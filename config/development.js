module.exports = {
    debug: true,
    app_name: "cloudui",
    port: 8000,
    controller_dirs: ['/api/open'],
    koa_middles_forbidden: {
        json_validator: true,
        authenticate: true,
        clouderr_handle: false
    },
    cloudeer: {
        type: 'rest', //可选 rest, tcp, zoo
        host: '127.0.0.1',
        port: 8801,
        not_a_consumer: false,
        not_a_service: true,
        no_methods_register: true,
        username: 'youku',
        password: 'youku123'
    }
};
