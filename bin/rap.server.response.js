var wakePromise = require("./rap.filesystem.promise.js");//异步

var wake = require("./rap.filesystem.js");//同步

var actionMap = require("./rap.server.response.action.js");

var filter = require("./rap.server.response.filter.js");

var mine = require("./rap.server.response.types.js");

var zlib = require("zlib");

var fs = require("fs");

var path = require("path");

var zlibMap = {

	"gzip": zlib.createGzip,
	"gunzip": zlib.createGunzip,
	"deflate": zlib.createInflate

};

function responseData(ret,request, response,type) {

	var zipType = rap.deflate ? "deflate" : "gzip";//response.headers['Content-Encoding'] undefined
	var spacialText = type=="text/text";
	type = (!spacialText&&type)|| "text/html";

	if(request.cookie.length){
		type = "text/plain";
	}

	var headerOption={
		"X-Powered-By":"robert-rap-server",
		"Content-Type":type,
		"Set-Cookie":request.cookie
	}
	var zip = zlibMap[zipType]();

	if( spacialText ){
        rap.log("请求结果为文本：", ret);
        response.writeHead(200,headerOption);
        response.end( ret);
        return;
	}
	//如果是string就表示是路径
	if (rap.type(ret) != "string") {
            rap.log("请求结果为json对象：", JSON.stringify(ret));
        	headerOption["Content-Type"] = "application/json";
            response.writeHead(200,headerOption);
            response.end(JSON.stringify(ret));
            //如果返回的是文件
	} else {
		var staticPathArr =rap.staticPathArr;
		var absolutePath = staticPathArr[0];
		for(var i=0;i<staticPathArr.length;i++){
			//如果不存在就去commonpath中寻找
			var absolutePathTemp = (staticPathArr[i]+"/" + ret).toURI()
			if( wake.isExist(absolutePathTemp)){
				absolutePath = absolutePathTemp;
				break;
			}
			console.log("not find"+absolutePathTemp.red);
		}

		rap.log("请求结果为静态文件：", absolutePath);
		var acceptEncoding = request.headers["accept-encoding"];
		if (!acceptEncoding) {
			acceptEncoding = "";
		}
		if (acceptEncoding.match(new RegExp(zipType))) {
			rap.log("encoding by setting ", zipType);
			headerOption["Content-Encoding"] = zipType;
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response, zip)
		} else if (acceptEncoding.match(/\bgzip\b/)) {
			rap.log("encoding by ", "gzip");
			headerOption["Content-Encoding"] = "gzip";
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response, zlibMap["gzip"]())
		} else if (acceptEncoding.match(/\bdeflate\b/)) {
			rap.log("encoding by ", "deflate");
			headerOption["Content-Encoding"] = "deflate";
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response, zlibMap["deflate"]())
		} else {
			rap.log("no encoding ");
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response)
		}
	}

}



exports = module.exports = function (request, response) {

	var ret;

	var url = filter(request.url, request.params) || request.url;


	//匹配action文件
    if (typeof actionMap[url] == "function") {
        var timer = setTimeout(function () {
            throw new Error("response timeout");
        },600000);
        actionMap[request.url](request, response, function (ret,type) {
            clearTimeout(timer);
            responseData(ret,request, response,type);
        });
		return;
    }

    //map给string
    if (actionMap[url]) {
    	ret = actionMap[url];
	}else{
    	ret = url;
	}

    ret =  ret.toString();

    var extname = path.extname(path.basename(ret)).replace(".","").replace(/\?.*/,"");

	//静态文件
	if (extname && mine[extname]) {
        responseData(ret, request,response,mine[extname]);
	//单纯的字符串
	}else {
        responseData(ret, request,response,"text/text");
	}
}