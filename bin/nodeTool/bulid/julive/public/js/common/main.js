;
(function () {

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
/*TAB*/
	$(document).on("click",".tab-wrap>.tab-head>.tab-head-item",function(){

		var $this = $(this);
		var handle = $this.data("handle");

		//取消切换
		if($this.hasClass("disabled") && $this.hasClass("active") ){
			return false;
		}

		var $parent = $this.parents(".tab-wrap");
		var curIndex = $this.index();
		var $allHeadItem  = $parent.find(".tab-head-item");
		var $allBodyItem = $parent.find(".tab-body-item");
		var $body =  $parent.find(".tab-body");
		var bodyItemStr = $body[0].nodeName == "UL"?("<li class='tab-body-item'></li>"):("<div class='tab-body-item'></div>");


		//不存在目标
		if( $allBodyItem.eq(curIndex).length == 0 ){
			var time = $allHeadItem.length -  $allBodyItem.length;
			if(time>0){
				for(var i=0;i<time;i++){
					$body.append(bodyItemStr);
				}
				$allBodyItem = $parent.find(".tab-body-item");
			}
		}
		//隐式函数
		if(typeof $this[0][handle] =="function"){
			//利用函数的返回值添加功能
			if($this[0][handle]($allBodyItem.eq(curIndex),$this) === false){
				return
			}
		}

		$allHeadItem.removeClass("active");
		$allBodyItem.removeClass("active");
		$this.addClass("active");
		$allBodyItem.eq(curIndex).addClass("active");
		return false;
	});

	/*SELECT*/
	$(document).on("click",".selectWrap .select",function(){

		var $this = $(this);
		//取消切换
		if($this.hasClass("disabled") ){
			return false;
		}

		var $parent = $this.parents(".selectWrap");
		if($parent.hasClass("active")){
			$(".selectWrap").removeClass("active");
		}else{
			$(".selectWrap").removeClass("active");
			$parent.addClass("active");
		}

	}).on("click",".selectWrap .option p",function(){
		var $this = $(this);
		var text = $this.html().trim();
		var val = $this.attr("value");
		var $parent = $this.parents(".selectWrap");
		$parent.find(".selectValue").val(val).change();
		var $text = $parent.find(".selectText")
		if($text[0].nodeName=="INPUT"){
			$text.val(text);
		}else{
			$text.html(text);
		}
		$(".selectWrap").removeClass("active");
	});

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
	changeRem()
})();

/*简单弹窗*/
function dialog($dialog) {
	$dialog.show();
	centerDialog($dialog.find(".dialog"));
}
function centerDialog($dialog) {
	var t = ($(window).height()-$dialog.height())/2
	t = t<0?0:t;
	$dialog.css("top",t)
}
function closeDialog($dialog) {
	$dialog.hide()
}
$(document).on("click",".J-dialog-close",function (e) {
	closeDialog($(this).parents(".dialog-mask"))
});



