$(function () {
	//等比
	function getResize(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	}

	//获取范围
	function getRagen(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	}
	/*
	 *refrence,refrenceMax,refrenceMin,setMax,setMin
	 */
	function changeRootrem(obj,callback) {
		var val = getRagen(obj.refrence, obj.refrenceMax, obj.refrenceMin);
		var rem = getResize(obj.refrenceMax, obj.refrenceMin,val, obj.setMax, obj.setMin);
		if(typeof callback=="function"){
			callback(rem)
		}
	}
	function changeRem() {
		changeRootrem({
			refrence:$(window).width(),
			refrenceMax:640,
			refrenceMin:300,
			setMax:703.125,//625*18/16
			setMin:468.75,
		},function(rem){
			$("html").css("font-size", rem + "%");
		});
	}
	$(window).on("resize",function () {
		changeRem();
	});
	changeRem();
	
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
	
	$("#sidebar-collapse,.sidebar-mask").click(function () {
		$("#sidebar").toggleClass("mini-menu");
		$(".sidebar-mask").toggleClass("mini-menu");
	});

	$("#sidebar").on("click","#pageCommonSlideVue>li",function () {
		$("#sidebar").removeClass("mini-menu");
		$(".sidebar-mask").removeClass("mini-menu");
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
	}).on("mousewheel",".J-body-scroll",function () {

		if($(window).scrollTop()+$(window).height()+2>$(this).height()){
			$(this).trigger("scrollDown");
		}
	});

	var dialogMap={};
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


		var url = $this.data("url");
		var dialogId = $this.data("id");
		var dialogClass = $this.data("class");
		//防止重复弹出
		if(dialogMap[url]){
			return;
		}
		dialogMap[url] = true;
		if (url) {
			$pageDsync.data("dialog",true);
			$(".loading").show();
			 $.dialog("url:" + url, {
				dialogClass: dialogClass,
				title:$this.data("title"),
				bodyStyle:"max-width:10rem",
				id: (dialogId ? dialogId : ""),
				maskClose: false,
				closeAfter: function () {
					dialogMap[url] =false;
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
			$table.find("input[type='checkbox']").not($this).prop("checked",true).change().each(function(){
			this.dispatchEvent&&this.dispatchEvent(new Event('change'));
			});
		}else{
			$table.find("input[type='checkbox']").not($this).prop("checked",false).change().each(function(){
				this.dispatchEvent&&this.dispatchEvent(new Event('change'));
			});
		}
	})

	/**
	 * 下拉菜单
	 * */
	$(document).off("click", ".J-select").on("click", ".J-select", function (e) {
		if($(this).hasClass("J-mutil-select")&& ($(e.target).hasClass(".J-select-option")||$(e.target).parents(".J-select-option").length)){
			return false;
		}
		$(".J-select").not($(this)).removeClass("current");
		$(this).toggleClass("current");
	}).off("click", ".J-select-option .option").on("click", ".J-select-option .option", function () {
		var $option = $(this);
		var value = $option.data("value");
		var $select = $option.parents(".J-select");
		var $selectText = $select.find(".J-select-text");
		var $selectValue = $select.find(".J-select-value");
		if (value != "") {
			$selectText.addClass("ipt-not-empty");
		} else {
			$selectText.removeClass("ipt-not-empty");
		}
		function getMutilOptionData($select){
			var names = [];
			var values = [];
			var allSelect = true;
			$select.find(".option input").each(function () {
				var $input = $(this);
				var $curOption = $input.parents(".option");
				if(!$input.hasClass("J-select-all-ipt")){
					if($input.prop("checked")){
						names.push( $curOption.data("name"));
						values.push($curOption.data("value"));
					}else{
						allSelect = false;
					}

				}
			});
			return {names:names,values:values,allSelect:allSelect}
		}
		//多选下拉
		if($select.hasClass("J-mutil-select")){
			var $curInput = $option.find("input");
			if($curInput.prop("checked")){
				$curInput.prop("checked",false);
			}else{
				$curInput.prop("checked",true);
			}
			//全选
			if( $curInput.hasClass("J-select-all-ipt")){
				if($curInput.prop("checked")){
					$select.find("input").prop("checked",true);
					var selectData = getMutilOptionData($select);
					$selectText.val($option.data("name")).change();
					$selectValue.val(selectData.values.join(",")).change();
				}else{
					$select.find("input").prop("checked",false);
					$selectText.val("").change();
					$selectValue.val("").change();
				}
			}else{
				var selectData = getMutilOptionData($select);
				//已经全部选中需要把all-option的input的点亮
				if(selectData.allSelect){
					$select.find(".J-select-all-ipt").prop("checked",true);
					$selectText.val($select.find(".J-select-all-ipt").parents(".option").data("name")).change();
				}else{
					$select.find(".J-select-all-ipt").prop("checked",false);
					$selectText.val(selectData.names.join(",")).change();
				}
				$selectValue.val(selectData.values.join(",")).change();
			}
		}else{
			$selectText.val($(this).data("name")).change();
			$select.find(".J-select-value").val(value).data("option",$(this).data()).change();
			$(".J-select").removeClass("current");
		}
		$selectValue[0]&&$selectValue[0].dispatchEvent&&$selectValue[0].dispatchEvent(new Event('input'));
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
				var searchStr = [( $(this).data("qp")||"") ,($(this).data("jp")||"")  , ($(this).data("name")||"" )].join(",")
				if( searchStr.toLowerCase().indexOf(key.toLowerCase())==-1){
					$(this).hide()
				}else{
					$(this).show()
				}
			})
		}

	});
});
