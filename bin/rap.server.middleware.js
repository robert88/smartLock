

exports = module.exports = function (request) {
	for (var i = 0; i < rap.requestStack.length; i++) {
		rap.stack[i](request);
	}
};

exports.prototype= {
	pipe:function (func) {
		rap.requestStack.push(func)
	},
	unpip:function (func) {
		var idx = stack.indexOf(func);
		if(idx!=-1){
			rap.requestStack.splice(idx,1);
		}
	}
};