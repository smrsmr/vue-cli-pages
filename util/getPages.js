const glob = require("glob")
let pages = {}
module.exports.pages = function () {
	glob.sync("./src/modules/*/*.js").forEach(filepath => {
		let fileList = filepath.split("/")
		let fileName = fileList[fileList.length - 2]
		pages[fileName] = {
			entry: `src/modules/${fileName}/main.js`,
			// 模板来源
			template: `src/modules/${fileName}/index.html`,
			// 在 dist/index.html 的输出
			// filename: process.env.NODE_ENV === "development" ? `${fileName}.html` : `${fileName}/${fileName}.html`,
			// 提取出来的通用 chunk 和 vendor chunk。
			// chunks: ["chunk-vendors", "chunk-common", fileName]
		}
	})
	return pages
}