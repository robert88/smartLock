var http = require("http");
exports = module.exports = {
	"/":"/index.html",
	"/proxy":function(request,response,next){
		// $.ajax({type:"post",url:"/proxy",dataType:"json",data:{ip:"14.215.177.38",port:443,proxyUrl:"proxyUrl"}})
		var url = request.params.proxyUrl
		if(url ){
			var option = {
				method: request.method,
				hostname: request.params.ip,
				path: url,
				port:request.params.port
			};
			if (request.method == "POST") {

				if (request["Content-Type"] == "application/json") {
					option.json = true;
					option.body = JSON.stringify(request.params);
					option.headers= {
						"content-type": request["Content-Type"]
					}
				} else {
					option.form=request.params;
				}

			} else {
				if (request["Content-Type"] == "application/json") {
					option.json = true;
					option.headers= {
						"content-type": request["Content-Type"]
					}
				}
			}

			http.request(option, function (proxyRes) {

				rap.log("proxy request create",proxyRes.statusCode);

				var body = [];
				proxyRes.on('data',function(d){
					body.push(d);
				}).on('end', function(){
					response.writeHead(proxyRes.statusCode,proxyRes.headers);
					response.end(body.join(""));
				});

			}).on('error', function(e) {
				throw e;
			}).end()

		}else{
			throw new Error("can not find proxy url!");
		}
	}
};