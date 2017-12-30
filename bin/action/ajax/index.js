var api = require("../../dao/rap.postgres.api.js");
exports = module.exports = {
	"getCode":function (request,response,next) {
		api.select(next,{name:"t_code"});
	},
	"insertCode":function (request,response,next) {
		api.insert(next,{name:"t_code"},request.params);
	},
	"/tool/handle/createFile":function (request,response,next) {
		console.log(request);
		next();
	}
};
