
/*不压缩代码必须加载之前使用*/
process.argv[2]="-debug"

//文件操作
require("./rap.util.prototype.js")
var wake = require("./rap.filesystem.js")
var mergeParseJs = require("../../toolLib/mergeParseJs.js")
var rootPath = __dirname;
 	
function pxToRem(files){
		for(var i=0;i<files.length;i++){
			var file = files[i];
			var fileData = wake.readData(file);
			var lastData = fileData.replace(/\d+(\.\d+)?px/gm,
				function(m){
					var a= parseFloat(m)||0;
					if(a>2){
						return (a/100+"rem")
					}else{
						return m
					}
				}).replace(/@media\s+\(min-width:\s+(\d+(\.\d+)?rem)\)/gm,function(m,m1){return m.replace(m1,parseFloat(m1)*100 + "px")});
			wake.writeData(file,lastData);
			console.log("px to rem:".red,file)
		}
}
	//改版本号
	var ver = Math.floor(new Date().getTime()/1000)

	var indexpcFile = "D:/git/smartLock/bin/lock-pc/index.html"
	var indexwapFile = "D:/git/smartLock/bin/lock-wap/index.html"
	wake.writeData(indexpcFile,wake.readData(indexpcFile).replace(/ver=(\d+)/gm,"ver="+ver).replace(/window.PAGE.version='\d+'/,"window.PAGE.version='"+ver+"'"))
	wake.writeData(indexwapFile,wake.readData(indexwapFile).replace(/ver=(\d+)/gm,"ver="+ver).replace(/window.PAGE.version='\d+'/,"window.PAGE.version='"+ver+"'"))

wake.copyDir("../lock-wap/", "./build/lock-wap/",function(){
		var files =wake.findFile(__dirname+"/build/lock-wap/","css",true);

		var buildwifi="D:/git/smartLock/bin/nodeTool/build/lock-wap/web/wechatwifi.html"
		wake.writeData(buildwifi,wake.readData(indexwapFile).replace('<div id="main-content-page"></div>','<div id="main-content-page">'+wake.readData(buildwifi)+"</div>"))

		pxToRem(files)
		wake.copyDir("D:/git/smartLock/bin/nodeTool/build/lock-wap", "D:/git/lock/lock-wap",function(){
			console.log("copy complete".green,"D:/git/smartLock/bin/nodeTool/build/lock-wap","to","D:/git/lock/lock-wap")
		})
		wake.copyDir("D:/git/smartLock/bin/lock-pc", "D:/git/lock/lock-pc",function(){
			console.log("copy complete".green,"D:/git/smartLock/bin/nodeTool/build/lock-pc","to","D:/git/lock/lock-pc")
		})
});

		

