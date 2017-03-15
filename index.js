'use strict';

var cloudoll = require('cloudoll');
const config = require('./config');
var serve    = require('koa-static');


var blockFavicon = function *(next) {
    if (this.url.match(/favicon\.ico$/)) {
        // console.log('favicon......');
        this.body = "";
        return;
    }
    yield next;
};


var middles = [
    blockFavicon
];

console.log(process.env.debug);


if (process.env.debug) {
    console.log("热加载启动");
    const path = require('path');
    //const Make = require("react-admin-lte").Make;
    const webpack = require("webpack");
    const devPath = path.resolve('./dev');

    // var mm = new Make({
    //     devMode: true,
    //     devPath: devPath,
    //     buildPath: __dirname,
    //     libAlias: {
    //         AdminLTE: path.join(devPath, 'res/lib/AdminLTE'),
    //         bootstrap: path.join(devPath, 'res/lib/bootstrap')
    //     }
    // });

    var webpackConf = require('./webpack-dev.config');
    //let webpackConf = mm.createWebpackConfig();

    webpackConf.resolveLoader = {
        root: path.join(__dirname, 'node_modules')
    };

    let compiler = webpack(webpackConf);

    var webpackDevMiddleware = require("koa-webpack-dev-middleware")(compiler, {
        hot: true,
        noInfo: false,
        publicPath: webpackConf.output.publicPath,
        headers: { "X-Custom-Header": "yes" },
        stats: {
            colors: true
        }
    });
    middles.push(webpackDevMiddleware);

    var hotMiddleware = require('koa-webpack-hot-middleware')(compiler);
    middles.push(hotMiddleware);
} else {
    // 生产模式下，这部分内容会被 nginx 代理，所以这个中间件是多余的。
    middles.push(serve('./dist'));
}

var app = new cloudoll.KoaApplication({
    middles: middles
});

//doll.orm.postgres.constr = config.postgres.conString;

// var mysql = doll.orm.mysql;
// mysql.connect(config.mysql);
// mysql.debug = true;

var mongo = cloudoll.orm.mongo;
mongo.connect(config.mongo.dburl);
mongo.debug = true;

/*


var cloudoll = require('cloudoll');
var serve    = require('koa-static');
var router = require('koa-router')()
var path = require('path')

var env = process.argv[2] || process.env.NODE_ENV
var debug = 'production' !== env
var viewDir = debug ? 'dev' : 'dist'
var staticDir = path.resolve(__dirname, '' + (debug ? 'dev' : 'dist'))

const render = require('koa-ejs');

// var blockFavicon = function *(next) {
//     if (this.url.match(/favicon\.ico$/)) {
//         // console.log('favicon......');
//         this.body = "";
//         return;
//     }
//     yield next;
//
// };
//
//
// var middles = [
//     blockFavicon
// ];


var app = new cloudoll.KoaApplication();

app.use(function*(next) {
    if (this.url.match(/favicon\.ico$/)) this.body = ''
    yield next
});

// logger
app.use(function*(next) {
    console.log(this.method.info, this.url)
    yield next
});

// global events listen
app.on('error', (err, ctx) => {
    err.url = err.url || ctx.request.url
    console.error(err, ctx)
});

// // use routes
// routes(router, app, staticDir)
// app.use(router.routes())

if(debug) {
    var webpackDevMiddleware = require('koa-webpack-dev-middleware');
    var webpack = require('webpack');
    var webpackConf = require('./webpack-dev.config');
    var compiler = webpack(webpackConf);

    // 为使用Koa做服务器配置koa-webpack-dev-middleware
    app.use(webpackDevMiddleware(compiler, webpackConf.devServer));

    // // 为实现HMR配置webpack-hot-middleware
    // var hotMiddleware = require("webpack-hot-middleware")(compiler);
    // // Koa对webpack-hot-middleware做适配
    // app.use(function* (next) {
    //   yield hotMiddleware.bind(null, this.req, this.res);
    //   yield next;
    // });

    var hotMiddleware = require('koa-webpack-hot-middleware')(compiler);
    app.use(hotMiddleware);
}

// handle static files
app.use(serve(staticDir, {
    maxage: 0
}));

render(app, {
        root: __dirname,
        //layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });

 */


/*
if(debug) {
    var webpackDevMiddleware = require('koa-webpack-dev-middleware')
    var webpack = require('webpack')
    var webpackConf = require('./webpack-dev.config')
    var compiler = webpack(webpackConf)

    // 为使用Koa做服务器配置koa-webpack-dev-middleware
    //app.use(webpackDevMiddleware(compiler, webpackConf.devServer))

    // 为实现HMR配置webpack-hot-middleware
    var hotMiddleware = require("webpack-hot-middleware")(compiler);
    // Koa对webpack-hot-middleware做适配
    // app.use(function* (next) {
    //   yield hotMiddleware.bind(null, this.req, this.res);
    //   yield next;
    // });

    var devWebpack = function*(next) {
        yield hotMiddleware.bind(null, this.req, this.res);
        yield next;
    };

    var app = new cloudoll.KoaApplication({
        middles: [
            blockFavicon,
            webpackDevMiddleware(compiler, webpackConf.devServer),
            devWebpack,
            serve(staticDir, {maxage: 0})
        ]
    });
}else{
    var app = new cloudoll.KoaApplication({
        middles: [
            serve(staticDir, {maxage: 0}),
            blockFavicon
        ]
    });
}

render(app, {
        root: __dirname,
        //layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });

*/
