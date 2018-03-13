

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "removeGroupFromSituation";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];
	var $dialog = $module.parents(".dl-dialog");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var situational_name,situational_id;
	if ($triggerBtn && $triggerBtn.length) {
		situational_name = $triggerBtn.data("situational_name");
		situational_id = $triggerBtn.data("situational_id");
	}

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],

			params:{page_number:1,page_size:10,situational_id:situational_id,token:token},
			device_list:[],
			device_params:{page_number:1,situational_id:situational_id,page_size:10,token:token}
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
			refreshDeviceList:function () {
				// ### 4.21 获取带策略信息的设备列表

				var $$vue = this;
				var url = "/smart_lock/v1/device/find_strategy_list";
				var type = "post";
				PAGE.ajax({
					url: url, 
					data: $$vue.device_params,
					type: type, 
					success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.device_list = ret;
						$dialog.trigger("setcenter");
					},
					complete: function () {
						setTimeout(function () {
							$dialog.trigger("setcenter");
						},100);
					}
				});
			},
			refreshList:function () {
				// ### 4.19 查询分组下设备列表
				// |  POST  |  smart_lock/v1/device_group/find_device  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  group_id | Interger | 是 |  分组id  | 返回该用户有控制权限的设备 |

				var $$vue = this;
				var url =  "/smart_lock/v1/strategy/find_list";
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
						listMap[$$vue.params.page_number] = ret.list;
						$$vue.total_page = ret.total_page;
						$$vue.list = $$vue.mergeArray(listMap);
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			// ### 8.5 情景模式删除设备分组
			// |  POST  |  smart_lock/v1/situational_mode/delete_group|
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  situational_id | Interger | 是 | 情景模式id  |  |
			// | group_ids  | String | 是| 分组id集合，逗号分割 |  |
			remove:function (index) {

				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/delete_group";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:$$vue.list[index].id,user_id:user_id}, type: type, success: function (ret) {
						$.tips($$vue.list[index].name+"设备组已移出"+situational_name+"情景！","success");
						$$vue.list.splice(index,1);
					}
				});
			},
			authSelected:function () {
				// ### 8.5 情景模式删除设备分组
				// |  POST  |  smart_lock/v1/situational_mode/delete_group|
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
				var url = "/smart_lock/v1/situational_mode/delete_group";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:$$vue.list[index].id,user_id:user_id}, type: type, success: function (ret) {
						$.tips($$vue.list[index].name+"设备组已移出"+situational_name+"情景！","success");
						$$vue.list.splice(index,1);
					}
				});
			},
			lisenChange:function ($module) {
				var $$vue = this;
				$module.on("change",".J-select-value",function () {
					var $this = $(this);
					var $parent = $this.parents(".list-item").addClass("loading")
					var index = $(this).data("index");
					var strategy_id = $(this).val();
					var device_id = $$vue.device_list[index].id;
					var url = "/smart_lock/v1/situational_mode/set_strategy";
					var type = "post";
					PAGE.ajax({
						url: url, data: {situational_id:situational_id,device_id:device_id,strategy_id:strategy_id,token:token}, type: type, success: function (ret) {
							$parent.removeClass("loading");

						}
					});
				})
			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshDeviceList();
				this.refreshList();
				$module = $("#" + moduleId);
				this.lisenChange($module)
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