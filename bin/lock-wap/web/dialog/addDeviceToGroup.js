

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "addDeviceToGroup";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];
	var $dialog = $module.parents(".dl-dialog");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var group_id;
	if ($triggerBtn && $triggerBtn.length) {
		group_id = $triggerBtn.data("group_id");
	}

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,group_id:group_id,token:token}
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
				var url = "/smart_lock/v1/device_group/find_no_device";
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
						$$vue.$nextTick(function () {
							$dialog.trigger("setcenter");
						})
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			addToGroup:function (index) {
				// ### 4.17 分组添加设备
				// |  POST  |  smart_lock/v1/device_group/add_device  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// | group_id| Interger | 是 |  分组id  |  |
				// |device_ids | String |是 | 设备id集合| 2345,3456|
				var $$vue = this;
				var url = "/smart_lock/v1/device_group/add_device";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:$$vue.list[index].id,group_id:group_id}, type: type, success: function (ret) {
						$.tips("操作成功！","success");
						$$vue.list.splice(index,1);
					}
				});
			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#" + moduleId);
			})
		}
	});

	$module.on("scrollDown." + moduleId, ".J-scroll",function () {
		if (!$$vue.loading) {
			$$vue.getNextPage();
		}
	});

	PAGE.destroy.push(function () {
		if($$vue){
			$("body").off("scrollDown." + moduleId);
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module=null
		}
	})
});