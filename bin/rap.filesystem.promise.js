var fs = require('fs');
var pt = require('path');
var debug = require("../bin/rap.server.debug.js");

/*
 * 写流文件
 * */
function createWriteStream(file,outpath,zip){
	return new Promise(function (resolve) {

		var out,inp;

		if(typeof outpath=="object"){
			out = outpath;
			inp = fs.createReadStream(file);
		}else{
			out = fs.createWriteStream(outpath, {encoding: 'utf-8', bufferSize: 11});
			inp = fs.createReadStream(file, {encoding: 'utf-8', bufferSize: 11});
		}
		
		if(zip){
			inp.pipe(zip).pipe(out);
		}else{
			inp.pipe(out);
		}

		inp.on("end", function () {
			resolve();
		});
	});
}
/*
 * 获得文件大小
 * */
function getFileSize(file, create) {

	return new Promise(function (resolve, reject) {

		fs.stat(file, function (err, fileInfo) {
			if (err) {
				//如果没有找到文件就直接创建
				if (create) {
					writeData(file, "").then(function () {
						resolve();
					});
				} else {
					throw err;
				}

			} else {
				resolve(fileInfo.size);
			}
		});
	});
}

/*
 * dirpath="/foo/bar/baz/asdf/quux.jpg";
 * dirname="/foo/bar/baz/asdf";
 * */
var mkdir_resursion_in = function (resolve, reject, dirpath, dirname) {

	//判断是否是第一次调用
	if (typeof dirname === "undefined") {
		fs.exists(dirpath, function (existFlag) {
			if (existFlag) {
				//如果存在的话就不需要创建了
				resolve();
			} else {
				mkdir_resursion_in(resolve, reject, dirpath, pt.dirname(dirpath));
			}
		});
	} else {
		//判断第二个参数是否正常，避免第一次调用时传入错误参数
		if (dirname !== pt.dirname(dirpath)) {
			mkdir_resursion_in(resolve, reject, dirpath);
			return;
		}

		fs.exists(dirname, function (existFlag) {
			if (existFlag) {

				//上一层目录存在，就直接创建dirpath
				fs.mkdir(dirpath, function (err) {
					if (err) {
						throw err;
					}
					if (resolve) {
						resolve();
					}
				})

			} else {
				//上一层目录不存在，先创建dirname，
				mkdir_resursion_in(null, null, dirname, pt.dirname(dirname));
				//再创建dirpath
				fs.mkdir(dirpath, function (err) {
					if (err) {
						throw err;
					}
					if (resolve) {
						resolve();
					}
				})

			}
		});
	}
}

var mkdir = function (dirpath) {
	return new Promise(function (resolve, reject) {
		mkdir_resursion_in(resolve, reject, dirpath)
	});
}

// 写文件
function writeData(path, data, append) {

	function promiseWriteData(){
		return new Promise(function (resolve) {

			// appendFile，如果文件不存在，会自动创建新文件
			// 如果用writeFile，那么会删除旧文件，直接写新文件
			if (append) {
				fs.appendFile(path, data, {encoding: 'utf8', mode: 438 /*=0666*/, flag: 'a'}, function (err) {
					if (err) {
						throw err;
					} else {
						resolve();
					}
				});
			} else {
				//flag:"a"表示追加
				fs.writeFile(path, data, {encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w'}, function (err) {
					if (err) {
						throw err;
					} else {
						resolve();
					}
				});
			}
		})
	}

	//目录必须存在
	return mkdir(pt.dirname(path)).then(promiseWriteData);


}
function delay(time) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve();
		}, time)
	})
}

/*对外接口*/
exports = module.exports = function () {
	return this;
};

exports.mkdir = mkdir;
exports.writeData = writeData;
exports.delay = delay;
exports.getFileSize = getFileSize;
exports.writeStream = createWriteStream;