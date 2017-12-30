/*
*
* @title：rap框架
* @author：尹明
*
* */
var childProcess = require('child_process');
var startTime = new Date();

require("./rap.util.core.config.js");
require("./dao/rap.sql.cache.js");

var requestFilter = require("./rap.server.require.js");
var handleResponse = require("./rap.server.response.js");
var wake = require("./rap.filesystem.js");

var domain = require('domain');

var http = require("http");

var requestCount = 0;
var processConfigURL = rap.rootPath.replace("/bin","") + "/log/config.json";
console.log(processConfigURL)
var processConfig
if(wake.isExist(processConfigURL)){
	 processConfig = wake.readData(processConfigURL).trim();
}else{
	processConfig = "";
	wake.writeData(processConfigURL,"");
}

//报错的时候要清除掉
var responseCache = [];

function requestRecord(){


}
// if(processConfig){
// 	processConfig = JSON.parse(processConfig);
// 	childProcess.exec('start "%windir%\\system32\\cmd.exe" '+"taskkill /pid "+processConfig.pid+" -t -f",function (err,stdout) {
//
// 		if(err){
// 			rap.error(err);
// 		}else {
// 			console.log("task kill process exit!");
// 		}
// 	});
//
// }

process.env.DEBUG =0;

if(process.env.DEBUG*1){
	var debugerProcess = childProcess.exec('start "%windir%\\system32\\cmd.exe" node-inspector --web-port=8081',function (err,stdout) {

		// if(err){
		// 	rap.error(err);
		// }else {
		// 	console.log("debuger process exit!");
		// }
		// wake.writeData(processConfigURL,JSON.stringify({pid:debugerProcess.pid}));
	});


}
function clearNullAndFinished(filter){
	var newArr = [];
	for(var i=0;i<responseCache.length;i++){
		if(responseCache[i] && responseCache[i].finished==false){
			if(typeof filter=="function" &&filter(responseCache[i])===false){
				continue;
			}
			newArr.push( responseCache[i] );
		}
	}
	responseCache =  newArr;
}
/**
 * Create HTTP server.
 */
var server = http.createServer(function(req, response) {

	clearNullAndFinished();

	responseCache.push(response);

	var d = domain.create();

	d.run(function () {
		try{
		requestCount++;

		rap.log("累计请求",requestCount);

		//延时处理，节流
		rap.debounce(requestRecord,60000);

		requestFilter(req,function(request){
			//当前的url是外部域名，且指定要代理
			
			handleResponse(request,response);

		});


		}catch (err){
			handlerErr(err,response,"trycatch")
		}
	});

	//捕获大部分异常
	d.on('error', function (err) {
		handlerErr(err,response,"domainErrorEvent")
	});



});

//处理
function handlerErr(err,response,name){
	if(typeof err =="string"){
		err = {message:err,stack:err};
	}
	rap.error(name,":",err.stack); // log the error

	if(err.stack&&err.stack.indexOf("no such file or directory")!=-1){
		response.writeHead(404);
		response.end(err.message);
	}else{
		response.writeHead(err.status||500);
		response.end(err.message);
	}

}
//捕获部分异常
process.on('uncaughtException', function (err) {

	// rap.error("uncaughtException:",err.stack); // log the error
	err.status = 505;
	clearNullAndFinished(function(response){
		handlerErr(err,response,"uncaughtException");
		response=null;
		return false;
	});
	//try {
		//var killTimer = setTimeout(function () {
		//	process.exit(1);
		//}, 30000);
		//killTimer.unref();

		//server.close();
	//} catch (e) {
	//	rap.error('error when uncaughtException', e.stack);
	//}



});

server.listen(3000);
if(process.env.DEBUG*1){

	childProcess.exec('start C:\\"Program Files (x86)"\\Google\\Chrome\\Application\\chrome.exe http://127.0.0.1:8081/?port=5858',function (err,stdout) {
		if(err){
			rap.error(err);
		}else {
			rap.log("chrome debugger run 8081");
		}
	});


}
childProcess.exec('start C:\\"Program Files (x86)"\\Google\\Chrome\\Application\\chrome.exe http://localhost:3000',function (err,stdout) {
	if(err){
		rap.error(err);
	}else {
		rap.log("chrome run 3000");
	}
});
var endTime = new Date();

rap.info("静态文件路径为",rap.staticPath,rap.rootPath+rap.staticPath);

rap.info("服务器启动在3000端口上,启动消耗",endTime-startTime,"ms");

// var server = http.createServer(function(req, response) {
// 	response.writeHead(200,{
// 		"X-Powered-By":"robert-rap-server",
// 		"Content-Type":"text/plain",
// 		"Set-Cookie":["a=2","b=2"]
// 	})
// 	response.end("helloword")
// }).listen(3001)
