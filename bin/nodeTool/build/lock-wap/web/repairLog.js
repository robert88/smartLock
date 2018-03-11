$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "repairLog";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params: {page_number: 1, page_size: 10, device_name: "", device_code: "", user_name:"",status:"",token: token}
		},
		watch: {

			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				this.refreshList();
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
				var url = "/smart_lock/v1/admin/get_report";
				var type = "get";
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
			},
			handleStatus:function (status) {
				if(status=="10"){
					return '<a class="bd bd-warning p10 t-warning bd-radius-5">报修中</a>'
				}else{
					return '<a class="bd bd-success p10 t-success bd-radius-5">已处理</a>'
				}
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

	$("body").on("scrollDown." + moduleId, function () {
		if (!$$vue.loading) {
			$$vue.getNextPage();
		}
	});

	$module.find(".J-scroll").on("scrollDown",function () {
		if(!$$vue.loading2){
			$$vue.getNextPage2();
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