/*
*
* @title：rap框架
* @author：尹明
*
* */
process.env.DEBUG =true;
global.rap = {};
rap.debug_module = true;
rap.requestStack = [];//过滤request
rap.rootPath= __dirname.replace(/\\/g,"/"); //"D:/newProject/jsweb/bin";

rap.connectionString = "postgres://postgres:'ym@20150904'@localhost/postgres";
rap.sqlFile={path :rap.rootPath+"/dao/sql"};
rap.sqldebug = true;

// rap.staticPath="/static_src";//debugger静态资源路径
// rap.perTool={
// 	spaIndex:"/static_src/index.html",
// 	normalIndex :"/static_src/indexStatic.html",
// 	html:"/static_src/web",
// 	publicFile:"/static_src/public",
// 	buildRegExp:{exe:/\/static_src\//,str:"/static/"}
// }


rap.staticPath="/senlin";//debugger静态资源路径
rap.perTool={
	spaIndex:"/senlin/index.html",
	normalIndex :"/senling/indexStatic.html",
	html:"/senlin/web",
	publicFile:"/senlin/public",
	buildRegExp:{exe:/\/static_src\//,str:"/static/"}
};

rap.commonPath="/common";//公共静态资源
rap.actionPath="/action";//ajax请求路径或者是拦截url
rap.deflate = false;//deflate gzip压缩
if(!process.env.DEBUG){
	rap.staticPath="/static";//静态资源路径
}
rap.staticPathArr = [];
rap.staticPathArr.push((rap.rootPath + "/lock" ));
// rap.staticPathArr.push((rap.rootPath + "/shanxi-wap" ));
// rap.staticPathArr.push((rap.rootPath + "/shanxi" ));
// rap.staticPathArr.push((rap.rootPath + "/" + rap.staticPath ));
// rap.staticPathArr.push((rap.rootPath + "/" + rap.commonPath  ));

require('./rap.util.prototype.js');
require('./rap.util.tool.js');
require('./rap.util.module.js');
require("./rap.util.color.js");
require("./rap.util.timeout.js");
require("./rap.server.debug");

