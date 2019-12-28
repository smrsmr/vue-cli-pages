const webpack = require("webpack");
const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
let pageMethod = require("./util/getPages.js");
pages = pageMethod.pages();
let env = process.env.NODE_ENV;
module.exports = {
	// 基本路径
	publicPath: env !== "development" ? "/" : "/",
	pages,
	// 多页
	/* 	pages: {
			screen: {
				// 应用入口配置，相当于单页面应用的main.js，必需项
				entry: "src/modules/screen/main.js",

				// 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
				template: "public/screen.html",

				// 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
				filename: "screen.html",

				// 标题，可选项，一般情况不使用，通常是在路由切换时设置title
				// 需要注意的是使用title属性template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
				// title: "console page",

				// 包含的模块，可选项
				// chunks: ["chunk-vendors", "chunk-common", "ui"]
			},
			contract: {
				// 应用入口配置，相当于单页面应用的main.js，必需项
				entry: "src/modules/contract/main.js",

				// 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
				template: "public/contract.html",

				// 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
				filename: "contract.html",

				// 标题，可选项，一般情况不使用，通常是在路由切换时设置title
				// 需要注意的是使用title属性template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
				// title: "console page",

				// 包含的模块，可选项
				// chunks: ["chunk-vendors", "chunk-common", "ui"]
			}
		}, */
	// 静态资源目录 (js, css, img, fonts)
	assetsDir: "assets",

	//关键点在这  原来的 Compiler 换成了 runtimeCompiler
	runtimeCompiler: true,

	//设置打包之后是否打包.map文件
	productionSourceMap: env !== "development" ? false : true,

	// 输出文件目录
	outputDir: "dist",
	// 让样式找到源
	css: {
		sourceMap: true
	},
	devServer: {
		port: 8083,
		host: "0.0.0.0",
		hot: true,
		open: false,
		disableHostCheck: true,
		proxy: {
			"/api": {
				target: "127.0.0.1", //对应跨域的接口
				changeOrigin: true,
				ws: false,
				pathRewrite: {
					"^/api": ""
				}
			}
		}
	},

	chainWebpack: config => {
		config.resolve.alias.set("@", path.resolve(__dirname, "./src"));
	},

	configureWebpack: config => {
		if (env !== "development") {
			// 配置打包 压缩js
			config.plugins.push(
				new CompressionWebpackPlugin({
					algorithm: "gzip",
					test: /\.js$|\.html$|.\css/, //匹配文件名
					threshold: 10240, //对超过10k的数据压缩
					deleteOriginalAssets: false, //不删除源文件
					minRatio: 0.8
				})
			);
		}
	}
};