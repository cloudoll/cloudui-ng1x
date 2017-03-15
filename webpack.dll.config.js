const webpack = require('webpack');
const path = require('path');
var bower_components_dir = path.join(__dirname, 'bower_components');
var node_modules_dir = path.resolve(__dirname, './node_modules');
var srcDir = path.resolve(process.cwd(), 'dev');
const isDebug =  process.env.NODE_ENV === 'development';
const outputPath = path.resolve(process.cwd(), 'lib'); //isDebug ? path.join(__dirname, '../common/debug') : path.join(__dirname, '../common/dist');
const fileName = '[name].js';
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 资源依赖包，提前编译
// const lib = [
//     'react',
//     'react-dom',
//     'react-router',
//     'history',
//     'react-addons-pure-render-mixin',
//     'react-addons-css-transition-group',
//     'redux',
//     'react-redux',
//     'react-router-redux',
//     'redux-actions',
//     'redux-thunk',
//     'immutable',
//     'whatwg-fetch',
//     'byted-people-react-select',
//     'byted-people-reqwest'
// ];

var aliasMap = {
    'jquery': 'jquery/dist/jquery.min.js',
    'angular': 'angular/angular.min.js',
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

const plugin = [
    new webpack.DllPlugin({
        /**
         * path
         * 定义 manifest 文件生成的位置
         * [name]的部分由entry的名字替换
         */
        path: path.join(outputPath, 'manifest.json'),
        /**
         * name
         * dll bundle 输出到那个全局变量上
         * 和 output.library 一样即可。
         */
        name: '[name]',
        context: __dirname
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
        //React: 'react',
        //ReactDOM: 'react-dom',
        //_: 'lodash', 按需引用
        $: 'jquery',
        jQuery: "jquery",
        "window.jQuery": "jquery",
        angular: 'angular',
        //Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
    })
];

if (!isDebug) {
    plugin.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin("vender.css"),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$', 'exports', 'require']
            },
            compress: { warnings: false },
            output: { comments: false }
        })
    )
}

module.exports = {
    devtool: '#source-map',
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
            //{test: /jquery.js$/, loader: "expose?jQuery!exports?window.jQuery" },
            {test: /angular.js$/, loader: "expose?angular!exports?window.angular" },
            {test: /angular-[^\.]+.js$/, loader: "imports?angular" },
            //{test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: "file-loader?name=[name].[ext]"},
            {test: /\.(tpl|ejs)$/, loader: 'html'}, //loader:'ejs'
            //{test: /\.html$/, loader: 'html'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.scss$/, loader: 'style-loader!scss$-loader'},
            {test: /\.jsx?$/, loader: 'babel?presets[]=react,presets[]=es2015'},
        ]
    },
    entry: {
        "vender":Object.keys(aliasMap)
    },
    output: {
        path: outputPath,
        filename: fileName,
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: plugin
};