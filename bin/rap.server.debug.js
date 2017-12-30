var promise_wake = require("./rap.filesystem.promise.js");
var wake = require("./rap.filesystem.js");
var zip = require("./rap.server.debug.zip.js");
var pt = require("path");

var defaultSettings = {
	logPath: rap.rootPath.replace("/bin","")+"/log/",//日志存储的本地路径//"D:/newProject/jsweb/log/";
	initLogStr: "[init][rap.server.debug]", //启动打印开头
	dateFormat: {
		message: "yy/MM/dd hh:mm:ss", //消息中的时间格式
		filename: "yyMMdd_hhmmss" //文件名的时间格式
	},
	debounce: {
		time: 10000,//10s的时间启动写入到日志文件中
	},
	maxLogSize: 100 * 1024 * 1024,//单个文件最大值为100M
	maxlogNumber: 10,//多少的文件开始压缩，即启动压缩的文件数阀值。
	zipListen: {
		timeout: [0, 8, 12, 18],//打包监听的时间段
		clear: [0]//每周一（0）清除一次日志文件，会保留100M之内的当前文件
	}
};


/**
 *@parameter： files是所有的log文件
 *@result: 根据类型来过滤文件，按照拼英排序,过滤规则为：type开头的文件名,最后得到过滤后的文件名列表
 *
 * */
function getHistoryFile(files, type) {

	return files.filter(function (file) {

		var filename = pt.basename(file);

		if (new RegExp("^" + type).test(filename)) {

			return true;

		}

	}).sort();

}


/**
 *@parameter： file是单个文件名,文件类型必须为.log
 *@result: 提取文件名中的日期，文件名的格式必须type+日期+.log
 *
 * */
function getDateByPath(file, type) {

	return pt.basename(file).replace(new RegExp("^{0}|\\.log$".tpl(type), "g"), "");

}


/**
 *@parameter： files是所有的log文件
 *@result: 按照类型提取最近一次使用的文件的文件名中的日期
 *
 * */
function getHistoryActiveFile(files, type) {

	var curList = getHistoryFile(files, type);

	return curList[0] && getDateByPath(curList[0], type);
}


/**
 *@parameter： files是所有的log文件
 *@result: 提取类型为【log，warn，error，info】最近一次使用的文件的文件名中的日期
 *
 * */
function getConfig(logPath) {

	var files = wake.findFile(logPath, "log");

	return {
		log: getHistoryActiveFile(files, "log"),
		info: getHistoryActiveFile(files, "info"),
		error: getHistoryActiveFile(files, "error"),
		warn: getHistoryActiveFile(files, "warn")
	}
}


/**
 *@result: 定义模块全局变量 activeInfo 记录不同类型的不同状态下的activeTime激活时间
 *
 * */
var activeInfo = {
	config: getConfig(defaultSettings.logPath),
	handle: {
		log: function (data) {
			mergeHandleFunc(data, "log");
		},
		warn: function (data) {
			mergeHandleFunc(data, "warn");
		},
		info: function (data) {
			mergeHandleFunc(data, "info");
		},
		error: function (data) {
			mergeHandleFunc(data, "error");
		}
	}
};


/**
 *
 *@result: 给handler下的不同类型处理函数添加activeTime
 *
 * */
function initActiveTime() {

	["log", "warn", "info", "error"].forEach(function (type) {

		var func = activeInfo.handle[type];

		if (!func.activeTime) {

			if (activeInfo.config[type]) {

				func.activeTime = activeInfo.config[type];

			} else {

				func.activeTime = new Date().format(defaultSettings.dateFormat.filename);

			}

		}

	});

}

initActiveTime();


/**
 *@result: 根据type类型获取给handler下处理函数的activeTime，如果没的话，就重新初始化一次；
 *
 * */
function getActiveTime(type) {

	var func = activeInfo.handle[type];

	if (!func.activeTime) {

		initActiveTime();

	}

	return func.activeTime;

}


/**
 *@parameter： callerName调用函数名，type：日志类型，params：日志的message
 *@result: 外部打印接口合并到这个函数统一处理,并且直接console.log到打印台上，调用debounce可以每隔10S的时间写入到日志文件中
 *
 * */
function mergePortalFunc(type, callerName, params) {

	var typeStr = "[{0}][{1}][{2}]:".tpl(type, new Date().format(defaultSettings.dateFormat.message), callerName);

	var paramsStrArr = [];
	
	//将参数序列化
	for(var i=0;i<params.length;i++){

		if(typeof params[i] == "object"){

			paramsStrArr.push( rap.stringify(params[i]) );

		}else{

			paramsStrArr.push(params[i]);

		}

	}

	var paramsStr = paramsStrArr.join(" ");


	console.log(typeStr[type],paramsStr);

	rap.debounce(activeInfo.handle[type],defaultSettings.debounce.time, typeStr + paramsStr);

}


/**
 *@parameter： data是经过debounce加工之后的数据，data.params中收集了10s之内的日志消息
 *@result:  10的debounce时间已经结束，开始将多个message写入日志文件中，日志文件格式：type+日期+.log,当这个文件达到了100M就开始重新写入到新的activeTime文件中
 *
 * */
function mergeHandleFunc(params, type) {

	var func = activeInfo.handle[type];

	var file = defaultSettings.logPath + type + getActiveTime(type) + ".log";

	var str = params.join("\n")+"\n";

	promise_wake.getFileSize(file, true).then(function (size) {

		//大于100M就分文件
		if (size > defaultSettings.maxLogSize) {

			debug.info("类型为", type, "的日志文件(" + file + ")的大小已经达到", Math.floor(defaultSettings.maxLogSize / 1024), "kb");

			func.activeTime = new Date().format(defaultSettings.dateFormat.filename);

		}

		promise_wake.writeData(file, str, true).then(function () {

			console.log("[{0} file write success]".tpl(type));

		});

	});

}


/**
 *@result: 提供全局的对外接口，rap.log,rap.warn,rap.error,rap.info
 *
 * */
rap.extend(rap, {
	log: function () {

		var callerName = "";

		this.log.caller.toString().replace(/^function[^\{]+/ig, function (m) {

			callerName = m;

		});

		mergePortalFunc("log", callerName, arguments);
	},
	warn: function () {

		var callerName = "";

		this.warn.caller.toString().replace(/^function[^\{]+/ig, function (m) {

			callerName = m;

		});

		mergePortalFunc("warn", callerName, arguments);

	},
	info: function () {

		var callerName = "";

		this.info.caller.toString().replace(/^function[^\{]+/ig, function (m) {

			callerName = m;

		});

		mergePortalFunc("info", callerName, arguments);

	},
	error: function () {

		var callerName = "";

		this.error.caller.toString().replace(/^function[^\{]+/ig, function (m) {

			callerName = m;

		});

		mergePortalFunc("error", callerName, arguments);

	}
});


/**
 *@result:将文件files根据type筛选出来，然后打包到压缩文件中，压缩文件格式为：type+开始时间-结束时间.zip,每种类型的log文件数达到10个就打包到压缩文件中，压缩完后删除掉已压缩的文件。
 *
 *
 * */
function zipFile(files, type) {

	var curList = getHistoryFile(files, type);


	if (curList.length >= defaultSettings.maxlogNumber) {

		var zipFile = "D:/newProject/jsweb/log/{0}{1}-{2}.zip".tpl(type, getDateByPath(curList[0], type), getDateByPath(curList[curList.length - 1], type));

		rap.info("正在打包类型为：", type, "产生文件为：" + zipFile);

		zip.zip(zipFile, curList).then(function () {

				wake.remove(curList);

				rap.info("打包结束：", type, "已生成：" + zipFile, "删除打包过的文件", curList);

		});
	}
}

function getOversizefile(){

	return wake.findFile(defaultSettings.logPath, "log").filter(function (file) {

		var flag = true;

		["log", "warn", "info", "error"].forEach(function (type) {

			if (~file.indexOf(getActiveTime(type))) {

				flag = false;

			}

			return false;

		});

		return flag;

	});

}


/**
 *@result:按照星期【0,8,12,18】启动一次清除监听
 *
 *
 * */
rap.intervalByWeek(function () {

	var files =  wake.findFile(defaultSettings.logPath, "zip");

	wake.remove(files);

}, defaultSettings.zipListen.clear,"清除日志监听器");


/**
 *@result:按照时间点【0,8,12,18】启动一次压缩监听，文件是过滤掉当前正在使用的log文件，即每个文件大小都达到了的阀值
 *
 *
 * */
rap.intervalByHour(function () {

	var files = getOversizefile();

	//根据不同类型来压缩文件
	["log", "warn", "info", "error"].forEach(function (type) {

		zipFile(files, type);

	});

}, [0, 8, 12, 18],"打包日志监听器");


/*----------------------------start 初始化打印消息----------------------*/
console.log(defaultSettings.initLogStr,
	"activeInfo.config  activeTime(",
	"log:", activeInfo.config.log,
	"warn:", activeInfo.config.warn,
	"error:", activeInfo.config.error,
	"info:", activeInfo.config.info,
	")");

console.log(defaultSettings.initLogStr,
	"activeInfo.handle activeTime(",
	"log:", activeInfo.handle.log.activeTime,
	"warn:", activeInfo.handle.warn.activeTime,
	"error:", activeInfo.handle.error.activeTime,
	"info:", activeInfo.handle.info.activeTime,
	")");

console.log("启动打包监控，启动执行一次，之后每天按照0点，8点，12点，18点执行一次");

/*----------------------------end 初始化打印消息----------------------*/
