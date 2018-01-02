$(function () {
	var slideBars = [
		{
			hasSub:"",
			active:"",
			sub:[],
			href:"#/web/home.html",
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
			href:"",
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

	PAGE.$pageVue = new Vue({
		el:"#sidebar",
		data:{
			slideBars:slideBars
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
		$allBodyItem.eq(curIndex).addClass("active");

		if( !$.trim($curBodyItem.html()) && $this.attr("href") && !$curBodyItem.hasClass("loading")){
			$curBodyItem.addClass("loading");
			PAGE.insertByUrl($curBodyItem,$this.attr("href"),function () {
				$curBodyItem.removeClass("loading");
			})
		}
		return false;
	});
	
	$("#sidebar-collapse").click(function () {
		$("#sidebar,#main-content").toggleClass("mini-menu");
	})
	$(document).on("click",".dropdown",function () {
		$(this).toggleClass("open");
		return false;
    })


});
