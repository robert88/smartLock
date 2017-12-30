

//全局使用方法
;(function(){
	var $pageLoadContain = $("#page");
	var $pageCss = $("#pageCss");
	var $pageJs = $("#pageJs");
	var $pageLoad = $("#pageLoad");
	var $body = $("body");
	var pathmap = {};

	var PAGE = window.PAGE||{};

	/*对于局部需要使用定时器的时候，不要直接使用window.setTimeout*/
	PAGE.timer = [];
	//等比
	PAGE.getResize=function(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	}

	//获取范围
	PAGE.getRagen=function(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	}
	function remove(index){
		if(~index){
			PAGE.timer.splice(index,1)
		}
	}

	PAGE.setTimeout = function(callback){
		var args = Array.prototype.slice.call(arguments,0);

		args[0] = function(){
			if(typeof callback=="function"){
				callback.apply(window,args.slice(2));
			}
			remove(PAGE.timer.indexOf(timer));
		}

		var timer = setTimeout.apply(window,args);

		PAGE.timer.push(timer);
		return timer
	};

	PAGE.clearTimeout = function(timer){
		clearTimeout(timer);
	};

	/*
	 *页面重新加载
	 * */
	PAGE.reload = function(){
		window.location.reload()
	};

	/*
	 *页面loading效果
	 * */
	PAGE.loading = function(){
		$pageLoadContain.hide();
		$pageLoad.css("display", "flex");
	};

	/**
	 * 关闭loading效果
	 * */
	PAGE.closeLoading = function(){
		$pageLoadContain.show();
		$pageLoad.hide()
	};

	/**
	 * 变数组
	 * */
	PAGE.toArray=function(){
		return Object.prototype.toString.call(arr)=="[object Array]"?arr:[arr];
	};


	/**
	 * 从url中获取参数
	 * */
	PAGE.getParamsByUrl = function (url) {
		var obj = {};
		url = url||"";
		//？param還有param
		var params = url.split("?")[1]||url.split("?")[0];
		params = params?params.split("&"):"";
		for(var i=0;i<params.length;i++){
			var map = params[i].split("=");
			var key = map[0];
			var value = map[1];
			if(key){
				if(obj[key]){
					obj[key] = this.toArray(obj[key]).push(value)
				}else{
					obj[key] = value;
				}
			}
		}
		return obj;
	};

	/**
	 * 过滤掉没有用的include标签，提取include标签中的信息
	 * */
	function getIncludeInfo(innerHtml) {
		innerHtml = innerHtml.replace(/\s+/g," ");
		var includeReg = /<include[^>]*src\s*=\s*"?'?([^>]*)"?'?\s*[^>]*>([\u0000-\uFFFF]*?)<\/include>/gmi;
		var includeTag = innerHtml.match(includeReg);
		var includeFile = [];
		if(includeTag){
			$.each(includeTag,function (idx,val) {
				includeReg.lastIndex = 0;
				var files = includeReg.exec(val);
				if(files&&files[1]){
					//idx需要和tag同步
					includeFile.push({url:files[1].replace(/\s+/g,""),idx:idx});
				}else{
					innerHtml.replace(val,"");
				}
			});
		}
		return {html:innerHtml,fileList:includeFile,tagList:includeTag}
	}

	/**
	 * 从handlerInclude中获取参数
	 * */
	PAGE.handlerInclude = function (innerHtml,callBack) {

		var includeInfo = getIncludeInfo(innerHtml);

		var len = includeInfo.fileList.length;
		if(len==0){
			callBack(innerHtml,[]);
			return;
		}

		var configs = [];
		var uniqueAction={};

		$.each(includeInfo.fileList,function (idx,val) {

			PAGE.load(val.url,function (subhtml,config) {
				//去重复
				if(!uniqueAction[config.action]){
					configs.push(config);
					uniqueAction[config.action] =1;
				}
				len--;
				includeInfo.html=includeInfo.html.replace(includeInfo.tagList[val.idx],subhtml);
				if(len<=0){
					uniqueAction=null;
					callBack(includeInfo.html,configs);
				}
			});

		});
	};

	/**
	 *提供一个全局事件.当页面切换时候就清除
	 * */
	PAGE.on = function (type,selector,callback,context) {
		if(context){
			$(context).on(type,selector,callback);
			this.destroy.push(function () {
				$(context).off(type,selector,callback);
				callback =null
			});
		}else{
			$(selector).on(type,callback);
			this.destroy.push(function () {
				$(selector).off(type,callback);
				callback =null
			});
		}

	};

	/**
	 *获取hash值，如果没有hash就使用PAGE.HOME
	 * */
	PAGE.getHash = function (hash,home) {

		home = home==false?"":this.HOME;

		hash = hash||window.location.hash.trim();

		hash = hash ? hash : home;

		return hash;
	};


	/**
	 *设置当前nav的激活状态
	 * */
	var pageCurrNav="";

	PAGE.setNav = function (map) {
		var current  = getNavClass(map);
		$("html").removeClass(pageCurrNav).addClass(current);
		pageCurrNav = current;
	};

	/**
	 *更加自定义菜单map的或者配置的PAGE.MENU来获取菜单
	 * */
	function getNavClass(map) {
		map = map||PAGE.MENU;
		var config = PAGE.getHashConfig(window.location.hash);
		return map[config.action]||map[PAGE.MENU.DEFAULT];
	}

	/**
	 *根据PAGE.destroy中的函数执行一次就失效，但是返回true的函数保留
	 * */
	function destroyPage(){

		$body.scrollTop(0);

		var newDestroy = [];

		for(var i=0;i<PAGE.destroy.length;i++){
			if(typeof PAGE.destroy[i]=="function"){
				//注意顺序，相同的destroy是不会被执行的
				if(  newDestroy.indexOf(PAGE.destroy[i])==-1 && PAGE.destroy[i]()!=true){
					newDestroy.push(PAGE.destroy[i]);
				}
			}
		}

		PAGE.destroy = newDestroy;
	}


	/*
	 * 开发模式和生产模式的切换
	 * */
	PAGE.getHashConfig = function(hash,home) {

		hash = PAGE.getHash(hash,home);

		var params = PAGE.getParamsByUrl(hash);

		//"#/app/home.min.js?js=1&css=1" ==>"app/home.min"
		var action = hash.replace(/^#/, "").replace(/"|'/g, "").replace(/\?.*/, "").replace(/\.html$/, "").replace(/\.htm$/, "");

		//确保开发模式
		if(window.PAGE.STATICDEBUG){
			params.js = params.js||1;
			params.css = params.css||1;
		}else{
			window.console = window.console||{};
			window.console.log = function(){};//屏蔽console
		}

		return {
			url:hash,
			params:params,
			action:action
		}
	}

	function load(paths, callback, loadFileType) {
		paths = $.toArray(paths);
		var loadStackHandle = [];
		for (var i = 0; i < paths.length; i++) {
			if (!pathmap[paths[i]]) {
				pathmap[paths[i]] = {status: "ready"};
			}
			loadStackHandle.push({src: paths[i]});
		}
		var len = loadStackHandle.length;
		if (len) {
			loadStackHandle[len - 1].callback = callback;
		}//最后一个js带上callback
		append(loadStackHandle, loadFileType);
	}
	function append(loadStackHandle, loadFileType) {
		if (loadStackHandle.length == 0) {
			return;
		}
		var handle = loadStackHandle.shift();
		var path = handle.src;
		if (pathmap[path].status != "ready"){
			return
		}
		pathmap[path].status = "loadding";
		var loadFileDom;
		if (loadFileType == "link") {
			loadFileDom = document.createElement("link");
			$pageCss.append(loadFileDom);

		} else {
			loadFileDom = document.createElement("script");
			$pageJs.append(loadFileDom);
		}

		loadFileDom.onerror = function () {
			console.error(path + " load fail!");
			pathmap[path].status = "loaded";
		};
		loadFileDom.onload = loadFileDom.onreadystatechange = function () {
			pathmap[path].status = "loaded";
		};
		if (loadFileType == "link") {
			loadFileDom.type = "text/css";
			loadFileDom.rel = "stylesheet";
			loadFileDom.href = path
		} else {
			loadFileDom.type = "text/javascript";
			loadFileDom.src = path
		}
		waitload(path, handle, loadStackHandle, loadFileType)
	}

	function waitload(path, handle, loadStackHandle, loadFileType) {
		if (pathmap[path].status == "loaded") {
			if (typeof handle.callback == "function") {
				handle.callback();
			}
			append(loadStackHandle, loadFileType)
		} else {
			setTimeout(function () {
				waitload(path, handle, loadStackHandle, loadFileType);
			}, 50)
		}
	}

	/*
	 *自己调用只能调用一次，不然会出现死循环
	 * */

	function pageLoadSuccess(innerHtml,config){

		pathmap = {};
		$pageCss.html("");
		$pageJs.html("");
		destroyPage();

		PAGE.handlerInclude(innerHtml,function (innerHtml,subConfigs) {
			//优先加载css
			var cssFile=[],jsFile=[];
			if(config.params.css) {
				cssFile.push("{0}.css".tpl(config.action,PAGE.version));
			}
			if(config.params.js) {
				jsFile.push("{0}.js".tpl(config.action, PAGE.version));
			}
			$.each(subConfigs,function (idx,val) {
				if(val.params.css) {
					cssFile.push("{0}.css".tpl(val.action, PAGE.version));
				}
				if(val.params.js) {
					jsFile.push("{0}.js".tpl(val.action, PAGE.version));
				}
			});
			//加载样式
			load(cssFile,function () {
				//加载内容
				$pageLoadContain.html("<div id='pageDsync'>"+innerHtml+"</div>");
				//加载js
				load(jsFile,function () {
					$("#pageDsync").trigger("pagecontentloaded");
				},"script");
			},"link");

		});

	}


	/*
	 *跳到404页面
	 * */
	function pageRedirect404(hash) {
		//自己调用只能调用一次，不然会出现死循环
		if(window.PAGE.ERROR404==hash){
			$pageCss.html("");
			$pageLoadContain.html('<section style="text-align: center"><div> 404 sorry can find page! </section>');
			$pageJs.html("");
		}else{
			hashChange(window.PAGE.ERROR404);
		}
	}

	/**
	 *hashchange事件切换页面
	 * */
	function hashChange(hash) {

		var config = PAGE.getHashConfig(hash);

		//显示加载ui
		PAGE.loading();

		//显示加载html
		$.ajax({
			url: config.action + ".html",
			dataType: "html",
			success: function(innerHtml){
				console.log("page load success:",config.action);
				pageLoadSuccess(innerHtml,config);
			},
			error: function () {
				pageRedirect404(hash);
			},
			complete: function() {
				PAGE.closeLoading();
				$.dialog&&$.dialog.closeAll();
			}
		});
	}

	PAGE.load = function (hash,callback) {

		var config = PAGE.getHashConfig(hash,false);

		if(!config.action){
			callback("",config);
			return;
		}
		//显示加载html
		$.ajax({
			url: config.action + ".html",
			dataType: "html",
			success: function(innerHtml){
				console.log("page load include file success:",config.action);
				callback(innerHtml,config);
			},
			error: function () {
				callback("",config);
			}
		});
	};

	/**
	 *国际化
	 * */
	PAGE.lang = function (type,name){
		var path = this.languagePath +"/"+ type+"/"+name+".json"+"?ver="+this.language[type].version;
		console.log("获取国际化",type,name,path);
		$.ajax({
			url:path.toURI(),
			dataType: 'json', //json数据返回
			success:function(ret){
				PAGE.language[type] = PAGE.language[type]||{};
				$.extend(PAGE.language[type],ret);
			}
		})
	};

	/**
	 *监听hashchange事件切换页面，监听事件load事件
	 * */
	$(window).on("hashchange", function() {
		// hashChange();
		window.location.reload();
	});

	/**
	 *启动页面
	 * */
	hashChange();
}());

