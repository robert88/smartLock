$(function () {

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
	}).on("mousewheel",".J-scroll",function () {
		var childrenHeight = 0 ;
		$(this).children(".option").each(function () {
			childrenHeight += $(this).height()+$(this).css("padding-top").toFloat()+$(this).css("padding-bottom").toFloat()
		});
		if($(this).scrollTop()+$(this).height()+2>childrenHeight){
			$(this).trigger("scrollDown");
		}
	});


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

		var url = $this.data("url");
		var dialogId = $this.data("id");
		var dialogClass = $this.data("class");
		if (url) {
			$pageDsync.data("dialog",true);
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
				structureReady:function ($dialog) {
					//跨页面传递传递数据
					$dialog.data("trigger",$this);
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
