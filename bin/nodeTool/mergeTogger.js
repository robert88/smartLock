
/*不压缩代码必须加载之前使用*/
process.argv[2]="-debug"

//文件操作
require("./rap.util.prototype.js")
var wake = require("./rap.filesystem.js")
var mergeParseJs = require("../../toolLib/mergeParseJs.js")

//对外接口
function merge(parseFile, outPath,inPath) {
	
	var indexData = wake.readData( parseFile ).replace(/#\/web\//g,"");

	console.log("-------common index:".green,parseFile,"-----------".green)

	var files = wake.findFile(inPath,"html",true);
	
		handleInclude(files,outPath,indexData);
	handleREM(wake.findFile(outPath,"html",true))
	handleREM(wake.findFile(outPath,"css",true))

};
/*
*处理一个css
*/
function handleOneCss(file){
		var css= file.replace(".html",".css");
		if(wake.isExist(css)){
			var cssData = wake.readData( css )
			var cssCode
			if(cssData.trim()==""){
				cssCode = "";
			}else{
				cssCode = mergeParseJs.parseCss(css);
				cssCode = "<style  type='text/css'>"+cssCode+"</style>"
			}
		}else{
			cssCode = "";
		}
		return cssCode
}
/*
*处理一个css
*/
function handleOneJS(file){
		var jscode;
		var js = file.replace(".html",".js");
		if(wake.isExist(js)){
			var jsData = wake.readData( js )
			if(jsData.trim()==""){
				jscode = "";
			}else{
				jscode = mergeParseJs.parseJs(js);
				jscode = "<script>$(function(){"+jscode + "})</script>"
			}
		}else{
			jscode="";
		}
		return jscode;
}
/**
处理多个css*/
function handleCss(files){
	var code =[];
		for(var i=0;i<files.length;i++){
			var file = files[i];
			code.push(handleOneCss(file));
		}
		return code.join("")
}
/**
处理多个js*/
function handleJs(files){
	var code =[];
		for(var i=0;i<files.length;i++){
			var file = files[i];
			code.push(handleOneJS(file));
		}
		return code.join("")
}
/**
处理一个文件
*/
function handleOneInclude(file,outPath,indexData){
			var outFile = getBuildPath(file,outPath);
			console.log(file,"to".red,outFile)
			var subFiles = {};
			var subFilesArr = []
			var htmlData = handleOneFile(file,subFiles);
			subFilesArr.push(file)
			for(var sub in subFiles){
				subFilesArr.push(sub);
			}
			var cssData = handleCss(subFilesArr);
			var jsData = handleJs(subFilesArr);
		
				
		var lastData = indexData.replace('<div id="pageCss"></div>',cssData||"").replace(/@charset\s+"UTF-8";/g,"")
			.replace('<div id="page"></div>',htmlData.replace(/#\/web\//g,""))
			.replace('<div id="pageJs"></div>',jsData||"");
		//将简写替换加上.html
		lastData = lastData.replace(/href\s*=\s*"?#([^"]+)"?/gm,function(m,m1){var t=m1.split("?");return ('href="'+(t[0].indexOf(".html")!=-1?t[0]:t[0]+".html")+'"')})

		lastData = lastData.replace(/"\/index\.html#!\/web/gm,"\"/web").replace(/"\/admin\.html#!\/admin/gm,"\"/admin").replace(/"\/index\.html#/gm,"\"/web/home.html#").replace(/"\/index\.html"/gm,"\"/web/home.html\"").replace(/"\/admin\.html"/gm,"\"/admin/index.html\"")
		wake.writeData(outFile,lastData)
}
/**
处理多个文件
*/
function handleInclude(files,outPath,indexData){
		for(var i=0;i<files.length;i++){
			handleOneInclude(files[i],outPath,indexData)
		}
}
/**
处理单个文件
*/
function handleOneFile(file,subFiles){
			var fileData = wake.readData(file);
			var includeReg = /<include[^>]*>([\u0000-\uFFFF]*?)<\/include>/gmi;

			var includeTags = fileData.match(includeReg);

			if(includeTags){
				for(var j=0;j<includeTags.length;j++){
					var otherFile = includeTags[j].match(/src='?"?([^'"]+)'?"?/);
					if(otherFile&&otherFile[0]&&otherFile[1]){
						otherFile[1] = otherFile[1].replace("#","../julive");
						console.log(otherFile[1].green);
						fileData = replaceIncludeHtml(fileData,includeTags[j],otherFile[1],subFiles)
					}
				}
			}
			return fileData;
}
/**替换单个html
*/
function replaceIncludeHtml(currFileData,includeTag,subFile,subFiles){
	var fileData = wake.readData(subFile);
	var includeReg = /<include[^>]*>([\u0000-\uFFFF]*?)<\/include>/gmi;
	var subIncludeTag = fileData.match(includeReg);
	if(subIncludeTag){
		currFileData = currFileData.replace(includeTag,handleOneFile(subFile,subFiles))
	}else{
		currFileData = currFileData.replace(includeTag,fileData)
	}
	subFiles[subFile] = 1;
	return currFileData;
}
function handleREM(files,flag){
		for(var i=0;i<files.length;i++){
			var file = files[i];
			flag&&console.log(file)
			var fileData = wake.readData(file);
			var lastData = fileData.replace(/\d+(\.\d+)?px/gm,
				function(m){
					var a= parseFloat(m)||0;
					if(a>2){
						return (a/100+"rem")
					}else{
						return m
					}
				}).replace(/@media\s+\(min-width:\s+(\d+(\.\d+)?rem)\)/gm,function(m,m1){return m.replace(m1,parseFloat(m1)*100 + "px")});

			// if(file=="./bulid/julive/public/css/common/main.css"){
			// 	console.log(lastData)
			// }
			wake.writeData(file,lastData)
		}
}
function copyPublic(inPath,outpath){
	console.log("-------copy public:".red,inPath," to:".green,outpath);
	var out = getBuildPath(inPath,outpath);

	wake.copyDir(inPath,out,function () {
		console.log("ok",wake.findFile(out,"css",true))
		handleREM(wake.findFile(out,"css",true),1)
	});


}


/*根据文件所在的位置 换成 打包之后的文件所在位置*/
function getBuildPath(from,to){
	/*去掉..保留实际的路径*/
	return (to+"/"+from.replace(/\.\.\//g,"").replace(/\.\//g,"") ).toURI();
}


/*打包存放路径*/
var bulidPath = "./bulid"


/*所有文件路径*/
var allHtmlPath = "../julive/web"

/*整体公用文件*/
var parseFile = "../julive/indexStatic.html";



merge(parseFile,bulidPath,allHtmlPath);

copyPublic("../julive/public",bulidPath);


