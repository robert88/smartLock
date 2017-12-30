
/*不压缩代码必须加载之前使用*/
process.argv[2]="-debug"

//文件操作
require("./rap.util.prototype.js")
var wake = require("./rap.filesystem.js")
var mergeParseJs = require("../../toolLib/mergeParseJs.js")

function handleREM(files){
		for(var i=0;i<files.length;i++){
			var file = files[i]
			var fileData = wake.readData(file);
			var lastData = fileData.replace(/\d+(\.\d+)?rem/g,function(m){ var a= parseFloat(m)||0;return (a*16+"px")})
			wake.writeData(file,lastData)
		}
}
/*所有文件路径*/
var allHtmlPath = "../julive/web"
var publicFile = "../julive/public"

	handleREM(wake.findFile(publicFile,"html",true))
	handleREM(wake.findFile(allHtmlPath,"html",true))
	handleREM(wake.findFile(publicFile,"css",true))
	handleREM(wake.findFile(allHtmlPath,"css",true))