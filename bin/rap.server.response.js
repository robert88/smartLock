var wakePromise = require("./rap.filesystem.promise.js");//异步

var wake = require("./rap.filesystem.js");//同步

var actionMap = require("./rap.server.response.action.js").actionMap;

var filter = require("./rap.server.response.filter.js");

var mine = require("./rap.server.response.types.js");

var zlib = require("zlib");

var fs = require("fs");

var path = require("path");

var qs = require('querystring');

var https = require("https");

var http = require('http');

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

	var url = (filter(request.url, request.params) || request.url).trim()
	//兼容中文路径
	url = decodeURIComponent(url);
	//匹配action文件
	if(~url.indexOf("/en/accounts/LoginPost")){
		console.clear();
        console.log(request.params)
	}
	//更新action
	if(~url.indexOf("/golbal/refresh/allAction")){
		console.log("-----------------------------------")
        require("./rap.server.response.action.js").init();
         actionMap = require("./rap.server.response.action.js").actionMap;
	}

	if (request.params.proxy){


		var opt = {
			host:request.params.proxyHost,
			port:'80',
			method:request.method,//这里是发送的方法
			path:url
			// headers:{}
		}

		var paramsStr =[]
		if(request.method=="POST"){
			// 	写完body之后一定要在end之前write，且必须设置content-type
			opt.headers=request.headers

		}else if(request.params&&qs.stringify(request.params)!="{}"){
			for(var i in request.params){
				if(i!="proxy"&&i!="proxyHost"&&i!="proxyIP"&&i!="proxyProtocol"){
                    paramsStr.push(i+"="+encodeURIComponent(request.params[i]));
				}
			}
            opt.path  = opt.path +"?"+paramsStr.join("&");
            opt.headers=request.headers
            opt.headers.host = opt.host
		}


		var body = '';
		var protocol = http
		if(request.params.proxyProtocol=="https"){
            protocol = https;
            opt.port =443
		}
		if(request.params.proxyIP){
            opt.ip =request.params.proxyIP;
		}
        rap.log("prox".red,opt)
		var req = protocol.request(opt, function(res) {
			//如果是图片不需要过滤掉cookie的话就直接使用这个方法
            if(res.headers["set-cookie"]){
                res.headers["set-cookie"].forEach(function(val,idx){
                    res.headers["set-cookie"][idx] = val.replace("domain=.huawei.com;","");
                });
            }
            response.writeHead(res.statusCode,res.headers);
			if(res.headers["content-type"]&&~res.headers["content-type"].indexOf("image")){
                res.pipe(response);
                return
			}
			console.log("Got response: " , res.headers.info);
			res.on('data',function(d){
				body += d;
			}).on('end', function(){
				console.log("返回数据",body.info);
				if(res.headers["set-cookie"]){
					res.headers["set-cookie"].forEach(function(val,idx){
						res.headers["set-cookie"][idx] = val.replace("domain=.huawei.com;","");
					});
				}

                // response.writeHead(res.statusCode,{
                // 	"date":new Date(),
                // 	"Connection":"Keep-Alive","content-type":"text/html;charset=utf-8","set-cookie":res.headers["set-cookie"]});
                // response.end( body);
				// response.writeHead(res.statusCode,res.headers);

                response.end(body);
			});

		}).on('error', function(e) {
			console.log("Got error: ".red + e.message);
            response.end(e);
		});
		if(request.method=="POST"){
			req.write(qs.stringify(request.params));
		}
		req.end();
		return;
		//action不区分大小写
	}else if (typeof actionMap[url.toLowerCase()] == "function") {
        var timer = setTimeout(function () {
            throw new Error("response timeout");
        },600000);
        actionMap[url.toLowerCase()](request, response, function (ret,type) {
            clearTimeout(timer);
            responseData(ret,request, response,type);
        });
		return;
    }

    //map给string
    if (actionMap[url.toLowerCase()]) {
    	ret = actionMap[url.toLowerCase()];
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
