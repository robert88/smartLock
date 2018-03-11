

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}

	var moduleId = "authUserModule";
	var moduleVueId = moduleId+"Vue";
	var $module = $("#"+moduleId);
	var $dialog = $module.parents(".dl-dialog");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var user_id;
	if ($triggerBtn && $triggerBtn.length) {
		user_id = $triggerBtn.data("user_id");
	}

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,user_id:user_id,token:token}
		},
		filters: {
			role:function (value) {
				switch (value){
					case 10:
						return "超级管理员"
						break;
					case 11:
						return "普通管理员"
						break;
					default:
						return "普通人员"
						break;
				}
			},
			type:function (value) {
				switch (value){
					case 1:
						return "开门"
						break;
					case 2:
						return "关门"
						break;
					default:
						return "更新密码"
						break;
				}
			},
		},
		methods:{
			filter:function () {
				$module.find(".search-filter-wrap").toggleClass("open");
			},
			refreshList:function () {
				// ### 4.11 查询某用户未授权设备列表
				// |  POST  |  smart_lock/v1/device/find_unauth_device  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- |: -------- | -------- | -------- | ---- |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				// | user_id | Interger | 是 | 用户id| |
				//
				// **ps 返回该用户有控制权限的设备 **
				// **返回**


				var $$vue = this;
				var url = "/smart_lock/v1/device/find_unauth_device";
				var type = "post";
				$module.addClass("loading");
				PAGE.ajax({
					url: url, data: this.params, type: type, success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;
						$dialog.trigger("setcenter");
						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
					},
					complete:function () {
						$module.removeClass("loading");
					}
				});
			},
			auth:function (index) {
				// ### 4.3 分配设备给某个用户
				// |  POST  |  smart_lock/v1/device/device_auth |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_id  | Interger   | 是 | 设备id  |  |
				// | user_id | Interger | 是 | 用户id | |
				var $$vue = this;
				var url = "/smart_lock/v1/device/device_auth";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:$$vue.list[index].id,user_id:user_id}, type: type, success: function (ret) {
						$.tips("设备授权成功！","success");
						$$vue.list.splice(index,1);
					}
				});
			},
			authSelected:function (index) {
				// ### 4.3 分配设备给某个用户
				// |  POST  |  smart_lock/v1/device/device_auth |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_id  | Interger   | 是 | 设备id  |  |
				// | user_id | Interger | 是 | 用户id | |


				var $$vue = this;
				var unSelect = [];
				var select = [];
				var ids = [];

				for(var i=0;i<$$vue.list.length;i++){
					if($$vue.list[i].selected){
						select.push($$vue.list[i]);
						ids.push($$vue.list[i].id)
					}else{
						unSelect.push($$vue.list[i]);
					}
				}
				if(select.length==0){
					$.tips("至少选择一台设备！","warn");
					return ;
				}
				var url = "/smart_lock/v1/device/device_auth";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:ids.join(","),user_id:user_id}, type: type, success: function (ret) {
						$.tips("设备授权成功！","success");
						$$vue.refreshList();
					}
				});
			},
			initEvent:function () {
				$module.on("scrollDown." + moduleId, ".J-scroll",function () {
					if (!$$vue.loading) {
						$$vue.getNextPage();
					}
				});


			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#"+moduleId);
				this.initEvent()
			})
		}
	});



	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
			$module=null
		}
	})
});