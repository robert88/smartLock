/**
 * @introduction：依赖jquery.dialog和jquery
 * @param 封装jquery ajax
 */

;
(function () {

	actionMap = {};

	function defaultError(text, tipsType) {

		$.tips(text, tipsType, 3000);

	}

	function checkAction(action, limitTime, error, errorCallBack) {
		if (!action) {
			console.log("i18n.sys.ajax.no.action", "operateErr", error, errorCallBack);
			return false;
		}

		actionMap[action] = actionMap[action] || {time: 0};

		if (actionMap[action].time >= limitTime) {
			console.log('i18n.sys.ajax.limit', "operateErr", error, errorCallBack);
			return false;
		}

	}


	function recordAction(action) {
		actionMap[action].time++;
	}

	function delRecordAction(action) {
		actionMap[action].time--;
	}

	function errorHander(ret, type, error, errorCallBack,codeMap) {
		var text = ret;

		var tipsType = "error";

		//系统错误提示
		if (type == "sysError") {
			tipsType = "error";
		}


		if (typeof ret == "object" && ret != null) {
			if(codeMap){
				text = codeMap[ret.code]|| ret.msg||"unknown"
			}else{
				text =  ret.msg || ret.code || "";
			}

		} else {
			text = text;
		}

		if (type == "dataError" && text == "200") {
			text = ret.message;
		}

		if (typeof error == 'function') {
			error(text, tipsType, type, ret);
		}

		if (typeof errorCallBack == "function") {
			errorCallBack(text, type, tipsType, ret);
		}

	}

	PAGE.ajax = function (options) {

		var defaultOption = {
			type: "post", //post请求
			cache:false,
			error: defaultError, //默认处理函数
			dataType: 'json', //json数据返回
			timeout: 120000, //2分钟超时
			$loadContain: null, //是loading容器
			loading:false,
			limitTime : 1 //请求限制不传表示不限制
		};

		var ajaxOption = $.extend({}, defaultOption, options);

		var success = ajaxOption.success,
			error = ajaxOption.error || defaultError,
			complete = ajaxOption.complete,
			errorCallBack = ajaxOption.errorCallBack;
		//ajax不会转json
		if (typeof ajaxOption.data != "string" && ajaxOption.processData == false) {
			ajaxOption.data = $.param(ajaxOption.data);
		}
		//代理
		var apiDomain = "smart-api.kitcloud.cn";
		try{

			if(window.location.host.indexOf(".kitcloud.cn")!=-1){
				document.domain = "kitcloud.cn";
			}
			
			if(ajaxOption.url.indexOf("http://")==-1){
				ajaxOption.url= "http://" + (apiDomain+ajaxOption.url).toURI()
			}
		}catch (e){
			console.error(e);
		}

		if(ajaxOption.url.indexOf("http://")==-1){
			ajaxOption.url= "http://" + (apiDomain+ajaxOption.url).toURI()
		}

		if(typeof ajaxOption.data=="object"){
			ajaxOption.data.proxy="true";
		}else if(typeof ajaxOption.data!="string"){
			ajaxOption.data ={proxy:true}
		}else{
			ajaxOption.data =ajaxOption.data+"&"+$.param({proxy:true})
		}
		ajaxOption.crossDomain=true;
		ajaxOption.xhrFields={withCredentials:true};


		if (checkAction(ajaxOption.url, ajaxOption.limitTime, error, errorCallBack) == false) {
			console.error("canot find action:", ajaxOption.url, " or ajax limit time >", ajaxOption.limitTime);
			return;
		}

		//限制条件计数
		recordAction(ajaxOption.url);


		ajaxOption.success = function (ret) {
			//二次解析
			var parseRet;
			try {
				if (typeof ret == "string") {

					parseRet = JSON.parse(ret);
					//如果parse错误是不会进行这个赋值
					ret = parseRet;
				}
			} catch (e) {
				console.error(e);
			}

			//state为true的时候表示请求成功
			if (ret && ret.code==200) {
				if (typeof success == "function") {
					success(ret.data, ret, "success");
				}
			} else {
				errorHander(ret, "dataError", error, errorCallBack,ajaxOption.msg);
				//session失效了
				if(ret.code==140026){
					PAGE.clearToken(true);
				}
			}

		}

		ajaxOption.complete = function () {

			delRecordAction(ajaxOption.url);
			if (typeof complete == "function") {
				complete.apply(null, arguments);
			}
			if(options.loading){
				$(".loading").hide();
			}
		}

		ajaxOption.error = function (XMLHttpRequest, textStatus, errorThrown) {
			try {
				var $text = $(XMLHttpRequest.responseText);
			} catch (e) {
				$text = $("<div>parseError</div>");
			}
			var msg = {
				code: XMLHttpRequest.status,
				msg: $text.text()||(XMLHttpRequest.status==0?"网络断开":"网络异常")
			}
			errorHander(msg, "sysError", error, errorCallBack,ajaxOption.msg)
		}



		//发送请求
		if(options.loading){
			$(".loading").show();
		}
		$.ajax(ajaxOption);
	};
	/*带btn*/
	PAGE.ajaxBtn = function ($btn, opts) {

		if ($btn.prop("disabled")) {
			console.log("i18n.sys.ajax.limit");
			return;
		}

		$btn.prop("disabled", true);

		var orgHtml;

		//按钮类型是input
		if ($btn.data("type") == "input") {
			orgHtml = $btn.val();
			$btn.val("...");
		} else {
			orgHtml = $btn.html();
			$btn.html("...");
		}

		var optsComplete = opts.complete;

		//保留传递过来的complete可以执行
		var complete = function () {
			if (typeof optsComplete == "function") {
				optsComplete();
			}
			$btn.html(orgHtml).prop("disabled", false);

		};
		opts.complete = complete;

		PAGE.ajax(opts)

	};

})()