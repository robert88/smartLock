var http = require('http');

var opt = {
	host:'www.baidu.com',
	port:'80',
	method:'POST',//这里是发送的方法
	path:' https://www.google.com',     //这里是访问的路径
	headers:{
		//这里放期望发送出去的请求头
	}
}
//以下是接受数据的代码
var body = '';
var req = http.request(opt, function(res) {
	console.log("Got response: " + res.statusCode);
	res.on('data',function(d){
		body += d;
	}).on('end', function(){
		console.log(res.headers)
		console.log(body)
	});

}).on('error', function(e) {
	console.log("Got error: " + e.message);
})
req.end();