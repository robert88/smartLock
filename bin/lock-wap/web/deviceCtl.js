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
				// 		### 4.6 修改设备信息
				// |  POST  |  smart_lock/v1/device/modify  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_id | Interger | 是 |  设备id  |  |
				// | device_name | String | 否 | 设备名称 | |
				// | device_model | String | 否|设备型号 | |
				var $$vue = this;
				var url = "/smart_lock/v1/device/modify";
				var type = "post";

				if (!$$vue.list[index].new_device_name) {
					$.tips("请输入设备名", "warn");
					return;
				}
				if (!$$vue.list[index].new_device_model) {
					$.tips("请输入设备型号", "warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {
						device_name: $$vue.list[index].new_device_name,
						device_id: $$vue.list[index].id,
						device_model: $$vue.list[index].new_device_model,
						token: token
					},
					success: function (ret) {
						$$vue.list[index].edit = "";
						$$vue.list[index].name = $$vue.list[index].new_device_name;
						$$vue.list[index].device_model = $$vue.list[index].new_device_model;
						$$vue.$forceUpdate();
						$.tips("修改成功！", "success");
					}
				});
			},
			// 		### 2.2 删除用户
			// |  POST  |  smart_lock/v1/user/delete  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  token | string | 是 | 用户登录的token |  |
			// |  user_id | Interger | 是 |  用户id  | 整形 |

			del: function (index) {
				var $$vue = this;
				if (!$$vue.list[index].id) {
					$$vue.list.splice(index, 1);
					return;
				}
				var url = "/smart_lock/v1/user/delete";
				var type = "post";
				var str = [
					'<div class="form-group J-validItem validItem">',
					'<label ><i class="t-danger fa-asterisk mr5 fs10"></i>手机验证码</label>',
					'<i class="fa-comment-o"></i>',
					// '<a class="btn btn-warning btn-send-code J-getMobileCode"><span class="text-gradient">发送验证码</span></a>',
					'<input type="text" class="form-control" name="sms_code" placeholder="请输入手机验证码!" check-type="required" data-focus="true">',
					'</div>'
				].join("");
				var $dialog = $.dialog(str, {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {

							PAGE.ajax({
								url: url,
								type: type,
								data: {user_id: $$vue.list[index].id, token: token},
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
						if (!ret) {
							return;
						}
						$.tips("操作成功！","success");
						$$vue.list[index].openStatus="已打开";
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
						if (!ret) {
							return;
						}
						$.tips("操作成功！","success");
						$$vue.list[index].openStatus="已关闭";
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			initEvent:function () {
				$module.parents(".tab-content-item").on("updateContent",function () {
					$$vue.refreshList();
				});

				$module.on("update",function () {
					$$vue.refreshList();
				});

				$module.on("click",".J-filter",function () {
					$$vue.filter();
				})

			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#" + moduleId)
				this.initEvent();
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