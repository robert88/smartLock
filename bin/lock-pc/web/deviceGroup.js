$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "deviceGroupModule";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params: {page_number: 1, page_size: 10, group_name: "", token: token}
		},
		watch: {

			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					this.refreshList();
				}
			},
			"params.group_name": function (newValue, oldValue) {
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
				// ### 4.11 查询分组列表
				// |  POST  |  smart_lock/v1/device_group/find_list  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// | group_name| String | 否 |  分组名称  |  |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				var $$vue = this;
				var url = "/smart_lock/v1/device_group/find_list";
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
						ret.list = ret.list||[];
						$$vue.list = ret.list;

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			saveAdd: function (index) {
				// 		### 4.8 创建设备分组
				// |  POST  |  smart_lock/v1/device_group/add  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  group_name | String | 是 |  分组名称 ||
				var $$vue = this;
				var url = "/smart_lock/v1/device_group/add";
				var type = "post";
				this.list[index].group_name = this.list[index].new_group_name;
				if (!this.list[index].group_name) {
					$.tips("请输入设备组名", "warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {group_name: this.list[index].group_name, token: token},
					success: function (ret) {
						$.tips("保存成功！", "success");
						$$vue.list[index].edit = "";
						$$vue.list[index].id = ret.id;
					}
				});
			},
			saveModify: function (index) {
				// ### 4.13 修改设备分组
				// 	|  POST  |  smart_lock/v1/device_group/modify  |
				// 	| ------------- |:-------------:|
				//
				// 	**请求参数：**
				//
				// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// 	|  -------- | -------- | -------- | -------- | ---- |
				// 	|group_id| Interger | 是 | 设备分组id| |
				// 	| group_name | String | 是 |  分组名称  |  |
				var $$vue = this;
				var url = "/smart_lock/v1/device_group/modify ";
				var type = "post";

				if (!$$vue.list[index].new_group_name) {
					$.tips("请输入设备组名", "warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {group_name: $$vue.list[index].new_group_name, group_id: $$vue.list[index].id, token: token},
					success: function (ret) {
						$$vue.list[index].edit = "";
						$$vue.list[index].group_name = $$vue.list[index].new_group_name;
						$$vue.$forceUpdate();
						$.tips("修改成功！", "success");
					}
				});
			},

			del: function (index) {
				// ### 4.10 删除设备分组
				// 	|  POST  |  smart_lock/v1/device_group/delete  |
				// 	| ------------- |:-------------:|
				//
				// 	**请求参数：**
				//
				// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// 	|  -------- | -------- | -------- | -------- | ---- |
				// 	| group_id| Interger | 是 |  分组id  |  |
				var $$vue = this;
				if (!$$vue.list[index].id) {
					$$vue.list.splice(index, 1);
					return;
				}


				var url = "/smart_lock/v1/device_group/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {group_id: $$vue.list[index].id, token: token},
								success: function () {
									$$vue.list.splice(index, 1);
								}
							});

						}
					}, {
						text: "取消", click: function () {

						}
					}]

				})
			},
			add: function () {
				this.list.unshift({
					edit: "add",
					group_name: "",
					new_group_name: "",
				})
			},
			cancelAdd: function (index) {
				this.del(index);
			},
			modify: function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_group_name = this.list[index].group_name;
				this.$forceUpdate()
			},
			cancelModify: function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#"+moduleId);
				this.initEvent($module);
			})
		}
	});




	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module = null
		}
	})
});