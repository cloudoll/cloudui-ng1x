'use strict';

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var _ = require('lodash');
var glob = require('glob');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
//var BowerWebpackPlugin = require("bower-webpack-plugin");
var AngularWebpackPlugin = require('angular-webpack-plugin');

var srcDir = path.resolve(process.cwd(), 'dev');
var assets = path.resolve(process.cwd(), 'dist');
var node_modules_dir = path.resolve(__dirname, './node_modules');
//var aliasMap = require('./dev/aliasMap.json');

var bower_components_dir = path.join(__dirname, 'bower_components');

var aliasMap = {
    'jquery': 'jquery/dist/jquery.js',
    'angular': 'angular/angular.js',
    'angular-ui-router':'angular-ui-router/release/angular-ui-router.min.js',
    'ng-dialog': 'ng-dialog/js/ngDialog.min.js',
    'angular-cookies':'angular-cookies/angular-cookies.min.js',
    'ng-dialog-css': 'ng-dialog/css/ngDialog.min.css',
    'ng-dialog-css-theme-default': 'ng-dialog/css/ngDialog-theme-default.min.css',
    'ng-dialog-css-theme-plain': 'ng-dialog/css/ngDialog-theme-plain.min.css',
    'angular-toasty':'angular-toasty/dist/angular-toasty.min.js',
    'angular-toasty-css':'angular-toasty/dist/angular-toasty.min.css',
    'sweet-alert':'sweetalert/dist/sweetalert.min.js',
    'sweet-alert-css':'sweetalert/dist/sweetalert.css',
    'sweet-alert-skin':'sweetalert/themes/facebook/facebook.css',
    'ng-sweet-alert':'ng-sweet-alert/ng-sweet-alert.js',
    'bootstrap': 'bootstrap/dist/js/bootstrap.min.js',
    'bootstrap-css':'bootstrap/dist/css/bootstrap.min.css',
    'moment': 'moment/min/moment.min.js',
    'admin-lte': 'AdminLTE/dist/js/app.js',
    'admin-lte-css':'AdminLTE/dist/css/AdminLTE.min.css',
    'admin-lte-skin':'AdminLTE/dist/css/skins/skin-blue-light.min.css',
    'font-awesome': 'font-awesome/css/font-awesome.min.css',
};

for (var key in aliasMap) {
    var depPath = path.resolve(bower_components_dir,aliasMap[key]);
    aliasMap[key] = depPath;
}

function entriesMap() {

    // var jsDir = srcDir; //path.resolve(srcDir, 'js');
    // //var entryFiles = glob.sync(jsDir + '/**/*.{js,jsx}');
    // var entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
    // var map = {};
    //
    // entryFiles.forEach(function (filePath) {
    //     var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    //     map[filename] = filePath
    // });
    //
    // return map;

    return {"main":path.resolve(srcDir, 'main.js')};
}

var entries = entriesMap();

//var chunks = Object.keys(entries);

function initPlugins() {
    var entryHtml = glob.sync(srcDir + '/*.html');
    var r = [];

    entryHtml.forEach(function (filePath) {

    //}(filePath) => {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        var conf = {
            template: 'html!' + filePath,
            filename: filename + '.html'
        }

        if (filename in entries) {
            conf.inject = 'body';
            conf.chunks = ['vender', 'common', filename];
        }

        //if(/b|c/.test(filename)) conf.chunks.splice(2, 0, 'common-b-c')

        r.push(new HtmlWebpackPlugin(conf));
    });

    return r;
}


var configWebpack =function (options) {

// } (options) =>
// {

    options = options || {};

    var debug = options.debug !== undefined ? options.debug : true;
    // 这里publicPath要使用绝对路径，不然scss/css最终生成的css图片引用路径是错误的，应该是scss-loader的bug
    var publicPath = '/';
    var extractCSS;
    var cssLoader;
    var sassLoader;

    var plugins = initPlugins();

    /*
     var plugins = () => {
     var entryHtml = glob.sync(srcDir + '/*.html')
     var r = []

     entryHtml.forEach((filePath) => {
     var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
     var conf = {
     template: 'html!' + filePath,
     filename: filename + '.html'
     }

     if(filename in entries) {
     conf.inject = 'body'
     conf.chunks = ['vender', 'common', filename]
     }

     //if(/b|c/.test(filename)) conf.chunks.splice(2, 0, 'common-b-c')

     r.push(new HtmlWebpackPlugin(conf))
     })

     return r
     }()
     */

    // 没有真正引用也会加载到runtime，如果没安装这些模块会导致报错，有点坑
    plugins.push(
        new webpack.ProvidePlugin({
            //React: 'react',
            //ReactDOM: 'react-dom',
            //_: 'lodash', 按需引用
            angular: 'angular',
            $: 'jquery',
            jQuery: "jquery",
            "window.jQuery": "jquery",
            //Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
        })
    );

    // //angular
    //plugins.push(new AngularWebpackPlugin);

    if (debug) {
        extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]');
        cssLoader = extractCSS.extract(['css']);
        sassLoader = extractCSS.extract(['css', 'sass']);
        plugins.push(
            extractCSS,
            new webpack.HotModuleReplacementPlugin()
            // new BowerWebpackPlugin({
            //     excludes: /.*\.less/
            // })
        );
    } else {
        extractCSS = new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        })
        cssLoader = extractCSS.extract(['css?minimize']);
        sassLoader = extractCSS.extract(['css?minimize', 'sass']);

        plugins.push(
            extractCSS,
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            }),
            // new AssetsPlugin({
            //     filename: path.resolve(assets, 'source-map.json')
            // }),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
            // new BowerWebpackPlugin({
            //     excludes: /.*\.less/
            // })
        );

        plugins.push(new UglifyJsPlugin());
    }

    var config = {
        // entry: Object.assign(entries, {
        //     // 用到什么公共lib（例如React.js），就把它加进vender去，目的是将公用库单独提取打包
        //     //'vender': venders
        // }),

        output: {
            path: assets,
            filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath,
            //libraryTarget:"var"
        },

        // externals:{
        //     "angular":"angular",
        //     "jquery": "jQuery"
        // },

        resolve: {
            root: [srcDir, node_modules_dir, bower_components_dir],
            alias: aliasMap,
            extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg']
        },

        module: {
            noParse:[],
            loaders: [
                {
                    test   : /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                    loaders: [
                        'url?limit=50000&name=img/[name].[ext]',
                        'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                    ]
                },
                {
                    test  : /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                    loader: 'url?limit=10000&name=fonts/[name].[ext]'
                },
                //
                // {
                //     test: /\.(woff2?|svg|jpe?g|png|gif|ico)$/,
                //     loaders: [
                //         // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                //         // 否则则调用file-loader，参数直接传入
                //         'url?limit=10000&name=img/[hash:8].[name].[ext]',
                //         'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                //     ]
                // },
                // {
                //     test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                //     loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
                // },
                //{test: path.resolve("bower_components", 'jquery/jquery.min.js'), loader: 'expose?jQuery'}
                //{test: /jquery.js$/, loader: "expose?jQuery!exports?window.jQuery" },
                {test: /angular.js$/, loader: "expose?angular!exports?window.angular" },
                {test: /angular-[^\.]+.js$/, loader: "imports?angular" },
                //{test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: "file-loader?name=[name].[ext]"},
                {test: /\.(tpl|ejs)$/, loader: 'html'}, //loader:'ejs'
                //{test: /\.html$/, loader: 'html'},
                {test: /\.css$/, loader: cssLoader},
                {test: /\.scss$/, loader: sassLoader},
                {test: /\.jsx?$/, loader: 'babel?presets[]=react,presets[]=es2015'},
            ]
        },

        plugins: [
            // new CommonsChunkPlugin({
            //     name: 'common-b-c',
            //     chunks: ['b', 'c']
            // }),
            new CommonsChunkPlugin({
                name: 'common',
                chunks: ['common']
            }),
            new CommonsChunkPlugin({
                 name: 'vender',
                 chunks: ['vender']
             })
        ].concat(plugins),

        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true,
                hash: false,
                timings: false,
                assets: true,
                chunks: true,
                chunkModules: true,
                modules: false,
                children: true
            }
        }
    }


    config.entry =  Object.assign(entries,{"vender":Object.keys(aliasMap)});

    if (debug) {
        // 为实现webpack-hot-middleware做相关配置
        // @see https://github.com/glenjamin/webpack-hot-middleware
        // ((entry) => {
        //     for (var key of Object.keys(entry))
        //     {
        //         if (!Array.isArray(entry[key])) {
        //             entry[key] = Array.of(entry[key]);
        //         }
        //         entry[key].push('webpack-hot-middleware/client?reload=true');
        //     }
        // });
        //(config.entry);

        for(var key in config.entry){
            if (!Array.isArray(config.entry[key])) {
                config.entry[key] = Array.of(config.entry[key]);
            }
            config.entry[key].push('webpack-hot-middleware/client?reload=true');
        }

        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.plugins.push(new webpack.NoErrorsPlugin());
    }


    return config
}

module.exports = configWebpack;
