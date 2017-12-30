var wake = require("./rap.filesystem.js");
rap.info("base路径：", rap.rootPath);
rap.info("action文件路径为：", rap.actionPath, rap.rootPath + rap.actionPath);
rap.info("根文件路径：", rap.rootPath+rap.staticPath);

var files = wake.findFile(rap.rootPath + rap.actionPath, "js", true);

//获取指定action目录
exports = module.exports = {};

files.forEach(function (file) {

	//提取对象
	var subMap = require(file);

	//提取action前缀
	var action = file.replace(rap.rootPath + rap.actionPath, "").replace(/\.js$/i, "");

	//得到完整的action
	for (var key in subMap) {
		if (typeof subMap[key] == "function") {

			//以/开始
			if(key.indexOf("/")==0){
				exports[key] = subMap[key];
			}else{
				exports[action + "/" + key] = subMap[key];
			}

		}else{
			exports[key] = subMap[key];
		}
	}

	//得到完整的action是当前文件
	if (typeof subMap == "function") {
		exports[action] = subMap;
	}

});

rap.info("action map", exports);