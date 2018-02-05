

//全局使用方法
;(function(){
	var $pageLoadContain = $("#main-content-page");
	var $pageCss = $("#main-content-css");
	var $pageJs = $("#main-content-js");
	var $pageLoad = $("#pageLoad");
	var $body = $("body");
	var pathmap = {};

	var PAGE = window.PAGE||{};

	/*对于局部需要使用定时器的时候，不要直接使用window.setTimeout*/
	PAGE.timer = [];

	//等比
	PAGE.getResize=function(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	};

	//获取范围
	PAGE.getRagen=function(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	};

	function remove(index){
		if(~index){
			PAGE.timer.splice(index,1)
		}
	}
	PAGE.oldSetTimeout = window.setTimeout;
	PAGE.oldClearTimeout = window.clearTimeout;

	window.setTimeout = function(callback){
		var args = Array.prototype.slice.call(arguments,0);

		args[0] = function(){
			if(typeof callback=="function"){
				callback.apply(window,args.slice(2));
			}
			remove(PAGE.timer.indexOf(timer));
		}

		var timer = PAGE.oldSetTimeout.apply(window,args);

		PAGE.timer.push(timer);
		return timer
	};

	window.clearTimeout = function(timer){
		remove(PAGE.timer.indexOf(timer));
		//必须使用call将this变成window才能调成功
		PAGE.oldClearTimeout.call(window,timer);
	};

	PAGE.setTimeout = setTimeout;
	PAGE.clearTimeout = clearTimeout;
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

			PAGE.loadPage(val.url,function (subhtml,config) {
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


		var newDestroy = [];

		pathmap = {};

		for(var i=0;i<PAGE.destroy.length;i++){
			if(typeof PAGE.destroy[i]=="function"){
				//注意顺序，相同的destroy是不会被执行的
				if(  newDestroy.indexOf(PAGE.destroy[i])==-1 && PAGE.destroy[i]()!=true){
					newDestroy.push(PAGE.destroy[i]);
				}
			}
		}

		for(i=0;i<PAGE.timer.length;i++){
			clearTimeout(PAGE.timer[i]);
		}

		PAGE.destroy = newDestroy;

		$.dialog.closeAll("all");
	}

	/**
	 *清除多余的事件
	 * */

	function destroyPageEvent(){
		$pageLoadContain.html("");
		$pageCss.html("");
		$pageJs.html("");
		$body.scrollTop(0);

		removeEventByGuid(window);
		removeEventByGuid(document);
		removeEventByGuid(document.body);

		$("body *").each(function () {
			removeEventByGuid(this);
		});
	}

	/**
	 *根据uuid清除多余的事件
	 * */

	function removeEventByGuid(elem){
		var elemData = jQuery.hasData( elem ) && jQuery._data( elem );
		var events;
		if ( !elemData || !( events = elemData.events ) || typeof events!="object" ) {
			return;
		}

		//标识之前的事件
		if(!$body.data("eventuuid")){
			$body.data("eventuuid",jQuery.guid);
		}
		var guid = $body.data("eventuuid");

		for(var type in events){
			var handlers = events[type];
			var j = handlers.length;
			while ( j-- ) {
				var handleObj = handlers[ j ];
				if(handleObj.guid > guid ){
					jQuery.event.remove( elem, handleObj.type, {guid:handleObj.guid } )
				}
			}
		}
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

	function load(paths, loadFileType,callback,$css,$js) {

		paths = $.toArray(paths);
		var loadStackHandle = [];
		for (var i = 0; i < paths.length; i++) {
			if (!pathmap[paths[i]]) {
				pathmap[paths[i]] = {status: "ready"};
			} else if(pathmap[paths[i]].status=="loaded"){
		         //加加了但是删除掉了
		        var $path;
		        if(loadFileType == "link"){
                    $path = $("[href='"+pathmap[paths[i]].src+"']");
		        }else{
                    $path = $("[src='"+pathmap[paths[i]].src+"']");
		        }
		        if($path.length==0){
		            pathmap[paths[i]] = {status: "ready"};
		        }
		    }
			loadStackHandle.push({src: paths[i]});
		}
		var len = loadStackHandle.length;
		if (len) {
			loadStackHandle[len - 1].callback = callback;
		}//最后一个js带上callback
		append(loadStackHandle, loadFileType,$css,$js);
	}
	PAGE.loadFile = load;
	function append(loadStackHandle, loadFileType,$css,$js) {
		$css = $pageCss;
		$js = $pageJs;
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
			$css.append(loadFileDom);

		} else {
			loadFileDom = document.createElement("script");
			$js.append(loadFileDom);
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
		waitload(path, handle, loadStackHandle, loadFileType,$css,$js)
	}

	function waitload(path, handle, loadStackHandle, loadFileType,$css,$js) {
		if (pathmap[path].status == "loaded") {
			if (typeof handle.callback == "function") {
				handle.callback();
			}
			append(loadStackHandle, loadFileType,$css,$js);
		} else {
			setTimeout(function () {
				waitload(path, handle, loadStackHandle, loadFileType,$css,$js);
			}, 50)
		}
	}

	/*
	 *自己调用只能调用一次，不然会出现死循环
	 * */

	function pageLoadSuccess(innerHtml,config){


		destroyPage();

		destroyPageEvent();

		insertHtml(innerHtml,$pageLoadContain,config,"#pageDsync")

	}

	/*动态插入dom和css pageDsync表示会插入id为pageDsync作为临时dom*/
	function insertHtml(innerHtml,$dom,config,pageDsync){
		PAGE.handlerInclude(innerHtml,function (innerHtml,subConfigs) {
			//优先加载css
			var cssFile=[],jsFile=[];
			if(config.params.css) {
				cssFile.push("{0}.css?ver={1}".tpl(config.action,PAGE.version));
			}
			if(config.params.js) {
				jsFile.push("{0}.js?ver={1}".tpl(config.action, PAGE.version));
			}
			$.each(subConfigs,function (idx,val) {
				if(val.params.css) {
					cssFile.push("{0}.css?ver={1}".tpl(val.action, PAGE.version));
				}
				if(val.params.js) {
					jsFile.push("{0}.js?ver={1}".tpl(val.action, PAGE.version));
				}
			});

			//加载样式
			load(cssFile,"link",function () {

				//加载内容
				if(typeof pageDsync=="string"){
					$dom.html("<div id='pageDsync'>"+innerHtml+"</div>");
				}else{
					$dom.html(innerHtml);
				}

				//加载js
				load(jsFile,"script",function () {
					if(typeof pageDsync=="string"){
						$(pageDsync).trigger("pagecontentloaded");
					}else if(typeof pageDsync=="function"){
						pageDsync();
					}
					$(".hasPermission").each(function () {
						var $this = $(this);
						if(!$this.data("initPermission")){
							if(Vue.prototype.hasPermission($(this).data("haspermission"))){
								$(this).show();
							}else{
								$(this).hide();
							}
							$this.data("initPermission",true);
						}

					})
				});

			});
		});
	}
	/**
	 * 动态插入html
	 * */
	PAGE.insertByUrl = function (dom,url,callBack) {

		PAGE.loadPage(url,function (subhtml,config) {
			//不需要传动态div
			insertHtml(subhtml,$(dom),config,callBack)
		});
	};


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
			PAGE.hashChange(window.PAGE.ERROR404);
		}
	}

	/**
	 *hashchange事件切换页面
	 * */
	PAGE.hashChange = function (hash) {
		var params = $.getParam(window.location.href)

		var config = PAGE.getHashConfig(hash);

		clearBreadcrumb();

		setBreadcrumb(config.action);

		if(config.params&&config.params.nomenu){
                $body.addClass("nomenu");
        }else{
            $body.removeClass("nomenu");
		}
		//url指明notHashPage或者notspa
		if((!hash&&params&&params.notHashPage) || PAGE.notSpa ||(!hash&&(window.location.pathname!="/"||!window.location.pathname))){
			setTitle();
			return;
		}
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

	PAGE.loadPage = function (hash,callback) {

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
		$.ajax({
			url:path.toURI(),
			dataType: 'json', //json数据返回
			success:function(ret){
				PAGE.language[type] = PAGE.language[type]||{};
				$.extend(PAGE.language[type],ret);
			}
		})
	};
	
	//全局方法
	Vue.prototype.isSelf =function (email) {
		var curAccordEmail = $.cookie("user_email");
		if(email&&(email==curAccordEmail)){
			return false;
		}
		return true;
	}
	Vue.prototype.hasPermission =function (access_id) {
		if(!access_id){
			return true;
		}
		var access_ids = access_id.toString().split(",");
		var access_list = $.cookie("access_list");
		for(var i=0;i<access_ids.length;i++){
			access_id = $.trim(access_ids[i]);
			if(new RegExp("\\b"+access_id+"\\b").test(access_list)){
				return true;
			}
		}
		return false;
	}
	Vue.prototype.mergeArray = function (obj) {
		if (typeof obj !== "object") {
			return [];
		}

		var arr = [];
		for (var no in obj) {
			if ($.type(obj[no]) != "array") {
				continue;
			}
			arr = arr.concat(obj[no]);
		}
		return arr;
	}

	/**
	 *设置表单数据
	 * */
	Vue.prototype.setInputValue=function (name, value,$module) {
		if (value != null && $module.find("input[name='" + name + "']").length) {
			$module.find("input[name='" + name + "']").val(value).addClass("ipt-not-empty");
		}
	}
	/**
	 *设置下拉菜单数据
	 * */
	Vue.prototype.setSelectValueByName=function (name, value,$module) {
		var $input = $module.find("input[name='" + name + "']")
		if (value != null && $input.length) {
			if($input.parents(".J-mutil-select").length){
				$.each(value.split(","),function (index,val) {
					if(val){
						$input.parents(".J-select").find(".option[data-name='" + val + "']").click();
					}
				})
			}else{
				$input.parents(".J-select").find(".option[data-name='" + value + "']").click();
			}

		}
	}
	/**
	 *设置下拉菜单数据
	 * */
	Vue.prototype.setSelectValue=function (name, value,$module) {
		var $input = $module.find("input[name='" + name + "']")
		if (value != null && $input.length) {
			if($input.parents(".J-mutil-select").length){
				$.each(value.split(","),function (index,val) {
					if(val){
						$input.parents(".J-select").find(".option[data-value='" + val + "']").click();
					}
				})
			}else{
				$input.parents(".J-select").find(".option[data-value='" + value + "']").click();
			}

		}
	}
	/**
	 *初始化事件
	 * */
	Vue.prototype.initEvent=function ($module) {
		var $$vue = this;
		$module.on("update",function () {
			$$vue.refreshList();
		})
		$module.on("click",".J-filter",function () {
			$$vue.filter();
		});
		$module.parents(".tab-content-item").on("updateContent",function () {
			$$vue.refreshList();
		});

	}

	var $$header = new Vue({
		el:"#pageCommonHeaderVue",
		data:{
			user_name:""
		}
	});
	var $$Breadcrumb =  new Vue({
		el:"#pageCommonBreadcrumbVue",
		data:{
			breadcrumb:[]
		},
	});

	var $$slider = new Vue({
		el:"#pageCommonSlideVue",
		data:{
			slideBars:[
				{
					hasSub:"",
					access_id:"12000",
					active:"",
					sub:[],
					href:"#/web/person.html",
					tips:0,
					text:"成员管理",
					icon:"fa-group-users"
				},
				{
					access_id:"13000",
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/device.html",
					tips:0,
					text:"设备管理",
					icon:"fa-hdd-o"
				},
				{
					access_id:"15000",
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/roleList.html",
					tips:0,
					text:"权限管理",
					icon:"fa-legal"
				},
				{
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/modifyLoginPwd.html",
					tips:0,
					text:"密码管理",
					icon:"fa-key"
				}
				,
				{
					access_id:"14000",
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/deviceCtl.html",
					tips:0,
					text:"门况信息",
					icon:"fa-beer"
				},
				// {
				// access_id:"14000",
				// 	hasSub:"",
				// 	active:"",
				// 	sub:[],
				// 	href:"",
				// 	tips:0,
				// 	text:"紧急预警",
				// 	icon:"fa-bell"
				// },
				{
					access_id:"18000",
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/situation.html",
					tips:0,
					text:"情景模式",
					icon:"fa-crop"
				},


				{
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/companyInfo.html",
					tips:0,
					text:"服务热线",
					icon:"fa-phone-square"
				},
				// {
				// 	hasSub:"",
				// 	active:"",
				// 	sub:[],
				// 	href:"#/web/repair.html",
				// 	tips:0,
				// 	text:"维修申报",
				// 	icon:"fa-truck"
				// },
				{
					access_id:"17000",
					hasSub:"",
					active:"",
					sub:[],
					href:"#/web/sysLog.html",
					tips:0,
					text:"系统日志",
					icon:"fa-truck"
				}
			]
		},
		filters:{
			href:function (href) {
				if(href){
					return href;
				}else{
					return "javascript:void(0);";
				}
			},

		},
		methods:{
			setSubClass:function (flag,oldClass) {
				return flag?("hasSub " +oldClass):oldClass;
			}
		},
		ready:function () {


		}
	});

	function clearBreadcrumb(){
		$$Breadcrumb.breadcrumb = [];
		$$Breadcrumb.breadcrumb.push({icon:"fa-home",href:"#/web/person.html","text":"首页"});
	}
	function setBreadcrumb(action) {
		var setActive = 0
		for(var i=0;i<$$slider.slideBars.length;i++){
			if(action&&$$slider.slideBars[i].href.indexOf(action+".htm")!=-1){
				if(i!=0){
					$$Breadcrumb.breadcrumb.push({icon:$$slider.slideBars[i].icon,href:$$slider.slideBars[i].href,"text":$$slider.slideBars[i].text})
				}
				$$slider.slideBars[i].active = "active";
				setActive = i;
			}else{
				$$slider.slideBars[i].active = "";
			}
		}
		//默认第一个
		if(!setActive){
			$$slider.slideBars[setActive].active= "active";
		}

	}
	PAGE.setToken = function (ret) {
		if(!ret){
			return
		}
		if(ret.token){
			$.cookie("token",ret.token);
		}
		if(ret.role_id){
			$.cookie("role_id",ret.role_id);
		}
		if(ret.user_email){
			$.cookie("user_email",ret.user_email);
		}
		if(ret.user_name){
			$.cookie("user_name",ret.user_name);
			$$header.user_name = ret.user_name
		}
		if(ret.access_list){
			$.cookie("access_list",ret.access_list);
			$$slider.$forceUpdate();
		}
		location.hash = ""
	}

	PAGE.getToken = function () {
		var token =$.cookie("token");
		if($.cookie("user_name")){
			$$header.user_name = $.cookie("user_name");
		}
		if(token){
			return token;
		}else{
			window.location.hash="#/web/login.html?nomenu=1";
		}
		return "";
	}
	/**
	 *启动页面
	 * */
	PAGE.clearToken = function () {
		$.cookie("token","");
		$.cookie("role_id","");
		$.cookie("user_email","");
		$.cookie("user_name","");
		$.cookie("access_list","");
		$$header.user_name = "";
		window.location.hash="#/web/login.html?nomenu=1";
	}
	/**
	 *监听hashchange事件切换页面，监听事件load事件
	 * */
	$(window).on("hashchange", function() {
		PAGE.hashChange();
		// window.location.reload();
	});
	/**
	 *启动页面
	 * */
	PAGE.hashChange();
}());

