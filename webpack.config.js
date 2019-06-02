/*var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
    //插件项
    plugins: [commonsPlugin],
    //页面入口文件配置
    entry: {
        index : './public/html/js/index.js'
    },
    //入口文件输出配置
    output: {
        path: __dirname+'/build',
        filename: 'app.js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        //查找module的话从这里开始查找
        root: './node_modules', //绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    }
}; */
module.exports = {
    //mode: 'development', 开发模式
    mode: 'production', //产品模式
    /*1. 入口(entry) */
    entry: './public/html/js/index.js',
    /*2. 输出(output) */
    output: {
        path: __dirname+'/build',
        filename: 'app.js'
    },
    /*3. 加载器(loader)——打包各种非JS模块文件*/
    module: {
        rules:[
            //CSS模块文件的加载规则
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    }
    /*4. 插件(plugin) */
}















