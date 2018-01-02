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
				text = codeMap[ret.code]||"unknown"
			}else{
				text = ret.code || ret.message || "";
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
		
		try{
			document.domain = "smart-api.kitcloud.cn";
			var apiDomain = "smart-api.kitcloud.cn";
			if(ajaxOption.url.indexOf("http://")==-1){
				ajaxOption.url= "http://" + (apiDomain+ajaxOption.url).toURI()
			}
		}catch (e){
			console.error(e);
		}

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
			if (ret && ret.code==1) {
				if (typeof success == "function") {
					success(ret.data, ret, "success");
				}
			} else {
				errorHander(ret, "dataError", error, errorCallBack,ajaxOption.msg)
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
				message: $text.text()
			}
			errorHander(msg, "sysError", error, errorCallBack,ajaxOption.msg)
		}

		//ajax不会转json
		if (typeof ajaxOption.data != "string" && ajaxOption.processData == false) {
			ajaxOption.data = $.param(ajaxOption.data);
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


	PAGE.validForm = function (opts) {

		var $form = $(opts.form);

		var validOpts = {
			success: function () {

				console.log("valiform ok");

				if (typeof opts.validSuccess == "function") {
					opts.validSuccess($form);
				}

				$form.removeClass("checking");

			},
			successList: function ($target) {
				var $parent = $target.parents(".J-validItem");
				$parent.addClass("validSuccess");
			},
			blurCallback: function ($target) {
				var $parent = $target.parents(".J-validItem");
				var action = $target.data("blur-ajax");

				if (action) {
					//将参数带入到action中
					action = action.tpl($target.val());

					//提供一个单独的处理ajax的接口
					if (typeof $target[0].blurAjaxBefore == "function") {
						if ($target[0].blurAjaxBefore() === false) {
							return;
						}
					}
					PAGE.ajax({
						url: action,
						success: function (data, ret) {
							//公共处理
							$parent.addClass("validSuccess");
							//提供一个单独的处理ajax的接口
							if (typeof $target[0].blurAjaxSuccess == "function") {
								if ($target[0].blurAjaxSuccess() === false) {
									return;
								}
							}
						},
						error: function (ret) {
							$parent.addClass("validErr");
							//提供一个单独的处理ajax的接口
							if (typeof $target[0].blurAjaxError == "function") {
								if ($target[0].blurAjaxError() === false) {
									return;
								}
							}
						}
					});
				}
			},
			focusCallback: function ($target) {
				var $parent = $target.parents(".J-validItem");
				$parent.removeClass("validErr").removeClass("validSuccess");
			},
			error: function ($target, msg, checkTypeName) {

				console.log("error", $target, msg, checkTypeName);

				var $parents = $target.parents(".J-validItem");

				$parents.addClass("validErr");

				$parents.find(".J-valid-msg").html(msg);
				$parents.find(".J-validIcon").html('<i class="icon-error"></i>');

				if (typeof opts.validError == "function") {
					opts.validError($target, msg, checkTypeName);
				}

				$form.removeClass("checking");

			}
		};

		$form.off("click", ".J-submitBtn").on("click", ".J-submitBtn", function () {
			//提交按钮在提交之后如果表正在校验就停止校验，没有变亮按钮也是不能校验的
			if ($form.hasClass("checking")||$(this).hasClass("disabled")) {
				console.log("form checking is lock!");
				return false;
			}
			$form.submit();
		});

		var $input = $form.find( "input" )
			.add( $form.find( "textarea" ) )
			.not( ".noCheck" )
			.not(":disabled")
			.filter( function(){
				var checkType = $( this ).attr( "check-type" )
				if(checkType || (checkType && checkType.indexOf("required")==-1 )){
					return true;
				}
				return false;
			});
		var $select = $form.find( "select" )
			.not( ".noCheck" )
			.not(":disabled")
			.filter( function(){
				var checkType = $( this ).attr( "check-type" )
				if(checkType || (checkType && checkType.indexOf("required")==-1 )){
					return true;
				}
				return false;
			});

		function checkBtn(){
			var ret = true;
			$input.each(function () {
				if($(this).val()==""){
					ret = false;
					return false;
				}
				if($(this).attr("type")=="radio"){
					if( $(this).parents(".J-label-radio-group").find(".checked").length==0 ){
						ret = false;
						return false;
					}
				}
			});
			if(ret){
				$select.each(function () {
					if($(this).val()==""){
						ret = false;
						return false;
					}
				});
			}
			if(ret){
				$form.find(".J-submitBtn").removeClass("disabled");
			}else{
				$form.find(".J-submitBtn").addClass("disabled");
			}
		}
		//输入之后变亮
		$form.off("keyup.checkBtn", $input).on("keyup.checkBtn",$input,function () {
			checkBtn()
		});

		$form.off("change.checkBtn", $select).on("change.checkBtn",$select,function () {
			checkBtn()
		});
		checkBtn();
		//对于提交按钮要求指定focus
		$("body").off("keyup.submit").on("keyup.submit",function (e) {
			if(e.key=="Enter"){
				$(this).find(".J-submitBtn.J-submitFocus").trigger("click");
			}
		});

		var validForm = $.valiForm($.extend(opts, validOpts));

		//提交
		$form.off("submit").on("submit", function () {
			try {
				/*防止重复提交*/
				var $this = $(this);
				if ($this.hasClass("checking")) {
					console.log("form checking is lock!");
					return false;
				}

				$this.addClass("checking");

				validForm();
			} catch (e) {
				$.tips(e, "error");
				console.error(e);
			}
			return false;
		});

		return validForm;
	}


})()