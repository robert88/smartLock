$(function () {
	var slideBars = [
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"#/web/person.html",
			tips:0,
			text:"成员管理",
			icon:"fa-group-users"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"#/web/device.html",
			tips:0,
			text:"设备管理",
			icon:"fa-hdd-o"
		},
		{
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
			href:"",
			tips:0,
			text:"密码管理",
			icon:"fa-key"
		}
		,
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"门况信息",
			icon:"fa-beer"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"紧急预警",
			icon:"fa-bell"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"情景模式",
			icon:"fa-crop"
		},

		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"我的智控",
			icon:"fa-cloud"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"勿扰模式",
			icon:"fa-umbrella"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"服务热线",
			icon:"fa-bell"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"服务热线",
			icon:"fa-phone-square"
		},
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"",
			tips:0,
			text:"维修申报",
			icon:"fa-truck"
		}
	];

	var $$header = new Vue({
		el:"#header-user",
		data:{
			user_name:""
		}
	});
	var $$slider = new Vue({
		el:"#sidebar",
		data:{
			slideBars:slideBars,
			user_name:""
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
			},
			setSlideActive:function (type) {
				type  = type||"index";
				for(var i=0;this.slideBars.length;i++){
					var item = this.slideBars[i];
					if(item.type==type){
						item.active = true;
					}else{
						item.active =false;
					}
				}
			}
		},
		ready:function () {
			this.setSlideActive("index");

		}
	});

	/*TAB*/
	$(document).on("click",".nav-tabs>li",function(){

		var $this = $(this);
		var handle = $this.data("handle");

		//取消切换
		if($this.hasClass("disabled") && $this.hasClass("active") ){
			return false;
		}

		var $parent =  $this.parents(".header-tabs");
		var curIndex = $this.index();
		var $allHeadItem  = $parent.find(".nav-tabs>li");
		var $allBodyItem = $parent.find(".tab-content-item");

		var $body =  $parent.find(".tab-content");
		var $boxTitle = $this.parents(".box").find(".box-title-text")
		var bodyItemStr = $body[0].nodeName == "UL"?("<li class='tab-content-item'></li>"):("<div class='tab-content-item'></div>");


		//不存在目标
		if( $allBodyItem.eq(curIndex).length == 0 ){
			var time = $allHeadItem.length -  $allBodyItem.length;
			if(time>0){
				for(var i=0;i<time;i++){
					$body.append(bodyItemStr);
				}
				$allBodyItem = $parent.find(".tab-content-item");
			}
		}
		var $curBodyItem = $allBodyItem.eq(curIndex);
		//隐式函数
		if(typeof $this[0][handle] =="function"){
			//利用函数的返回值添加功能
			if($this[0][handle]($curBodyItem,$this) === false){
				return
			}
		}

		$allHeadItem.removeClass("active");
		$allBodyItem.removeClass("active");
		$this.addClass("active");
		$allBodyItem.eq(curIndex).addClass("active").trigger("updateContent");

		if( !$.trim($curBodyItem.html()) && $this.attr("href") && !$curBodyItem.hasClass("loading")){
			$curBodyItem.addClass("loading");
			PAGE.insertByUrl($curBodyItem,$this.attr("href"),function () {
				$curBodyItem.removeClass("loading");
			})
		}
		if($boxTitle.length&&$this.data("title")){
			$boxTitle.html($this.data("title"));
		}
		return false;
	});
	
	$("#sidebar-collapse").click(function () {
		$("#sidebar,#main-content").toggleClass("mini-menu");
	});

	$(document).on("click",".J-loginout",function () {
		PAGE.clearToken();
		return false;
	});

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
	PAGE.clearToken = function () {
		$.cookie("token","");
		$.cookie("role_id","");
		$.cookie("user_email","");
		$.cookie("user_name","");
		$$header.user_name = "";
		window.location.hash="#/web/login.html?nomenu=1";
	}
	$(document).on("click",function (e) {
		var $dropdown;
		if($(e.target).hasClass("dropdown")){
			$dropdown = $(e.target);
		}else if($(this).parents(".dropdown").length){
			$dropdown = $(this).parents(".dropdown");
		}
		$(".dropdown").not($dropdown).removeClass("open");
	}).on("click",".dropdown",function () {
		$(this).toggleClass("open");
		return false;
    }).off("click.dragbg touchstart.dragbg", ".J-dialog").on("click.dragbg touchstart.dragbg", ".J-dialog", function (evt) {
		var $this = $(this);
		var $pageDsync = $("#pageDsync")
		//防止重复弹出
		if($pageDsync.data("dialog")){
			return;
		}
		$.dialog.closeAll();
		$pageDsync.data("dialog",true);
		var url = $this.data("url");
		var dialogId = $this.data("id");
		var dialogClass = $this.data("class");
		if (url) {
			$(".loading").show();
			$.dialog("url:" + url, {
				dialogClass: dialogClass,
				title:$this.data("title"),
				bodyStyle:"max-width:1000px",
				id: (dialogId ? dialogId : ""),
				maskClose: false,
				closeAfter: function () {
					$pageDsync.data("dialog",false);
				},
				ready: function ($dialog) {
					$(".loading").hide();
					//绑定到按钮上的ready事件
					if (typeof $this[0].dialogReady == "function") {
						$this[0].dialogReady($dialog);
					}
				}
			});
		}


	});
	/*
	* table组件
	* */
	$(document).on("click",".J-all-checkBox",function () {
		var $this = $(this);
		var $table = $this.parents(".J-table");
		if($this.prop("checked")){
			$table.find("input[type='checkbox']").not($this).prop("checked",true);
		}else{
			$table.find("input[type='checkbox']").not($this).prop("checked",false);
		}
	})

	/**
	 * 下拉菜单
	 * */
	$(document).off("click", ".J-select").on("click", ".J-select", function () {
		$(".J-select").not($(this)).removeClass("current");
		$(this).toggleClass("current");
	}).off("click", ".J-select-option .option").on("click", ".J-select-option .option", function () {
		var value = $(this).data("value");
		var $select = $(this).parents(".J-select");
		if (value != "") {
			$select.find(".J-select-text").addClass("ipt-not-empty");
		} else {
			$select.find(".J-select-text").removeClass("ipt-not-empty");
		}
		$select.find(".J-select-text").val($(this).html().replace(/^\s+|\s+$/, "")).change();
		$select.find(".J-select-value").val(value).data("option",$(this).data()).change();
		$(".J-select").removeClass("current");
		return false;
	}).on("focus.select",".J-select-text",function () {
		$(this).parents(".J-validItem").removeClass("validError").removeClass("validSuccess");
	}).on("click.select", function (e) {
		if (!$(e.target).hasClass("J-select") && $(e.target).parents(".J-select").length == 0) {
			$(".J-select").removeClass("current");
		}
		//支持搜索功能，data-jp,data-qp,data-name
	}).on("keyup.select",".J-select-text",function () {
		var key = $.trim($(this).val())
		if($(this).parents(".J-select-search").length){
			$(this).parents(".J-select-search").find('.J-select-option .option').each(function () {
				var searchStr = [( $(this).data("jp")||"") ,($(this).data("qp")||"")  , ($(this).data("name")||"" )].join(",")
				if( searchStr.toLowerCase().indexOf(key.toLowerCase())==-1){
					$(this).hide()
				}else{
					$(this).show()
				}
			})
		}

	});

});
