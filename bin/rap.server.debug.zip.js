var fs = require('fs');
var archiver = require('archiver');
var unzip = require("unzip");
var zlib= require("zlib");

exports = module.exports = {
	zipOne: function (outpath, file) {
		return new Promise(function (resolve) {
			var gzip = zlib.createGzip();
			var out = fs.createWriteStream(outpath, {encoding: 'utf-8', bufferSize: 11});
			var inp = fs.createReadStream(file, {encoding: 'utf-8', bufferSize: 11});
			inp.pipe(gzip).pipe(out);
			inp.on("end", function () {
				resolve();
			})
		})
	},
	zip: function (outPath, files) {
		return new Promise(function (resolve) {
			var out = fs.createWriteStream(outPath);
			var archive = archiver('zip');

			archive.on('error', function (err) {
				throw err;
			});
			var bulkFile = [];
			files.forEach(function (file) {
				bulkFile.push({src: file});
			});
			archive.pipe(out);
			archive.bulk(bulkFile);
			archive.finalize();
			archive.on("end",function () {
				resolve()
			})
		})

	},
	unzip: function (zipFile, outPath) {
		return new Promise(function (resolve) {
			var inp = fs.createReadStream(zipFile);
			inp.pipe(unzip.Extract({path: outPath}));
			inp.on("end", function () {
				resolve();
			})
		})
	}
};
