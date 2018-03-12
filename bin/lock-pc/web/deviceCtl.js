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
			},
			handleDeviceStatus:function (device_status) {
				if(device_status=="10"){
					return '<a class="fs14  t-success ">开启</a>'
				}else{
					return '<a class="fs14  t-muted ">关闭</a>'
				}
			},
			setDeviceModel:function (index) {
				$.dialog.closeAll();
				var html ='<div class="J-select">' +
					'<input type="text" placeholder="请选择模式" class="form-control J-select-text" style="width: 100%"> ' +
					'<input name="device_id" type="hidden" check-type="required" class="J-select-value device_id" > ' +
					'<i class="fa-angle-down"></i> ' +
					'<div class="J-select-option J-scroll">' +
					'<a data-name="全锁模式" data-value="1" class="option">全锁模式</a>' +
					'<a data-name="单向模式" data-value="2" class="option">单向模式</a>' +
					'<a data-name="常开模式" data-value="3" class="option">常开模式</a>' +
					'<a data-name="点动模式" data-value="4" class="option">点动模式</a>' +
					'<a data-name="双向模式" data-value="5" class="option">双向模式</a> ' +
					'<a style="display: none;">加载更多...</a></div></div>';
				var url =  "/smart_lock/v1/device_control/setting";
				var type = "post";

				$.dialog(html, {
					title: "请选择模式",
					maskClose:false,
					button: [{
						text: "确认", click: function (e,$dialog) {
							var value = $.trim( $dialog.find(".device_id").val() );
							if(!value){
								$.tips("请选择模式！");
								return false
							}
							PAGE.ajax({
								url: url,
								type: type,
								data: {device_id: $$vue.list[index].id, token: token,type_id:value},
								success: function () {
									$.tips("操作成功！", "success");
									$$vue.list.splice(index, 1);
								}
							});

						}
					}, {
						text: "取消", click: function () {

						}
					}]

				})
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#"+moduleId)
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
})
;