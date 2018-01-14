$(function () {
	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var $moudle = $("#personDetail");
	var $dialog = $moudle.parents(".dl-dialog");
	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var user_id;
	if ($triggerBtn && $triggerBtn.length) {
		user_id = $triggerBtn.data("id");
	}

	//添加角色
	var $$vue = new Vue({
		el:"#personDetail",
		data:{
			userInfo:{
				user_email:"",
				user_name:"",
				address:"",
				user_card:"",
				user_phone:"",
				role_id:"",
			},
			params:{page_number:1,page_size:6,user_id:user_id,token:token}
		},
		methods:{
			// 		### 2.3 查询用户信息
			// |  POST  |  smart_lock/v1/user/find  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  token | string | 是 | 用户登录的token |  |
			// |  user_id| INterger |是 | 用户id | |
			getDetail:function () {
				$moudle.addClass("loading");
				var $$vue = this;
				var url = "/smart_lock/v1/user/find";
				var type = "post";
				PAGE.ajax({url:url,type:type,data:$$vue.params,success:function (ret) {
					if( !ret ){
						return;
					}
					$$vue.userInfo = ret;
				},complete:function () {
					$moudle.removeClass("loading");
				}});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.getDetail();
			})
		}
	});
	//窗口关闭时调用
	$dialog[0].destory = function () {
		if($$vue){
			$$vue.$destroy();
			$form = null;
			$$vue = null;
			listMap = null;
			$dialog = null;
		}
	}
});