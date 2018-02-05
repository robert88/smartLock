$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "deviceModule";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params: {page_number: 1, page_size: 10, device_name: "", device_code: "", token: token}
		},
		watch: {

			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					this.refreshList();
				}
			},
			"params.device_name": function (newValue, oldValue) {
				if (newValue != oldValue) {
					listMap = [];
					if (this.params.page_number != 1) {
						this.params.page_number = 1;
					} else {
						this.refreshList();
					}
				}
			}
		},
		methods: {
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
			refreshList: function () {
				// ### 4.5 查询设备列表
				// |  POST  |  smart_lock/v1/device/find_list  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- |: -------- | -------- | -------- | ---- |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				// | device_name | String | 否 | 设备名称| |
				// | device_code | String | 否 | 设备编码 | |
				var $$vue = this;
				var url = "/smart_lock/v1/device/find_list";
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
			saveAdd: function (index) {

			},
			saveModify: function (index) {

			},


			del: function (index) {

			},
			add: function () {

			},

			cancelAdd: function (index) {

			},
			modify: function (index) {

			},
			cancelModify: function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
			openDevice:function (index) {
				// |  POST  |  smart_lock/v1/device_control/singal_open  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_id | Interger  | 是 | 设备id |   |
				var $$vue = this;
				var url = "/smart_lock/v1/device_control/singal_open";
				var type = "post";
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: {device_id:$$vue.list[index].id,token: token},
					type: type,
					success: function (ret) {
						$.tips("操作成功！","success");
						$$vue.list[index].status="已打开";
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			closeDevice:function (index) {
				// ### 3.4 关闭单个设备
				// |  POST  |  smart_lock/v1/device_control/singal_close  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_id | Interger   | 是 | 设备id |      |
				var $$vue = this;
				var url = "/smart_lock/v1/device_control/singal_close";
				var type = "post";
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: {device_id:$$vue.list[index].id,token: token},
					type: type,
					success: function (ret) {
						$.tips("操作成功！","success");
						$$vue.list[index].status="已关闭";
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#" + moduleId)
				this.initEvent($module);
			})
		}
	});

	$("body").on("scrollDown." + moduleId, function () {
		if (!$$vue.loading) {
			$$vue.getNextPage();
		}
	});


	PAGE.destroy.push(function () {
		if ($$vue) {
			$("body").off("scrollDown." + moduleId);
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module = null
		}
	})
})
;