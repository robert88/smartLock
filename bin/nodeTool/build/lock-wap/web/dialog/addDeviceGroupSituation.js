

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "addDeviceGroupToSituation";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];
	var $dialog = $module.parents(".dl-dialog");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var situational_id;
	if ($triggerBtn && $triggerBtn.length) {
		situational_id = $triggerBtn.data("situational_id");
	}

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,situational_id:situational_id,token:token}
		},
		methods:{
			mergeArray: function (obj) {
				if (typeof obj !== "object") {
					return [];
				}
				;
				var arr = [];
				for (var no in obj) {
					if ($.type(obj[no]) != "array") {
						continue;
					}
					arr = arr.concat(obj[no]);
				}
				return arr;
			},
			getNextPage: function () {
				if (!this.total_page) {
					return;
				}
				if (this.params.page_number < this.total_page) {
					this.params.page_number++;
					this.refreshList();
				}

			},
			filter: function () {
				$module.find(".search-filter-wrap").toggleClass("open");
			},
			isSelf: function (email) {
				if (email && (email == curAccordEmail)) {
					return false;
				}
				return true;
			},
			refreshList:function () {
				// ### 8.8 查询情景模式未绑定分组列表
				// |  smart_lock/v1/situational_mode/find_unbind_group  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// | situation_id| Interger | 是 |  情景模式id  |  |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/find_unbind_group";
				var type = "post";
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: $$vue.params,
					type: type,
					success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
						$$vue.$nextTick(function () {
							$dialog.trigger("setcenter");
						})
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			auth:function (index) {
				// ### 8.4 情景模式添加设备分组
				// |  POST  |  smart_lock/v1/situational_mode/add_group|
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  situational_id | Interger | 是 | 情景模式id  |  |
				// | group_ids  | String | 是| 分组id集合，逗号分割 |  |
				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/add_group";
				var type = "post";
				PAGE.ajax({
					url: url, data: {group_ids:$$vue.list[index].id,situational_id:situational_id}, type: type, success: function (ret) {
						$.tips("设备组设置情景生效！","success");
						$$vue.list.splice(index,1);
					}
				});
			},
			authSelected:function (index) {
				// ### 8.4 情景模式添加设备分组
				// |  POST  |  smart_lock/v1/situational_mode/add_group|
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  situational_id | Interger | 是 | 情景模式id  |  |
				// | group_ids  | String | 是| 分组id集合，逗号分割 |  |


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
					$.tips("至少选择一个设备组！","warn");
					return ;
				}
				var url = "/smart_lock/v1/situational_mode/add_group";
				var type = "post";
				PAGE.ajax({
					url: url, data: {group_ids:ids.join(","),situational_id:situational_id}, type: type, success: function (ret) {
						$.tips("设备组设置情景生效！","success");
						$$vue.list=unSelect;

					}
				});
			},
			initEvent:function ($module) {
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
				$module = $("#" + moduleId);
				this.initEvent($module);
			})
		}
	});



	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module=null
		}
	})
});