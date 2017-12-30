

exports = module.exports = {
	"/api/json":function (request, response,next) {
		var str = "/api/json";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:[{img:"/public/images/salt01.png",text:"螺旋藻碘盐"},{img:"/public/images/salt01.png",text:"螺旋藻碘盐"}]})
	}

};