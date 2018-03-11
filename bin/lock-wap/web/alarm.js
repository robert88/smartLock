$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "alarmModule";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params: {page_number: 1, page_size: 10, device_name: "", device_code: "", token: token},

			list2:[],
			loading2:false,
			total_page2:0,
			params2:{page_number:1,page_size:20,group_name:"",token:token}
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
			},
			handleDeviceStatus:function (device_status) {
				if(device_status=="10"){
					return '<a class="fs14 bd bd-success plr10 ptb5 t-success bd-radius-5">开启</a>'
				}else{
					return '<a class="fs14 bd plr10 ptb5 t-muted bd-radius-5">关闭</a>'
				}
			},
			authSelected:function () {
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
				var url = "/smart_lock/v1/device_control/emergency_mode";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:ids.join(","),token:token}, type: type, success: function (ret) {
						$.tips("操作成功！","success");
					}
				});
			}
		},

		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#" + moduleId);
				this.initEvent($module);
				var $height = $module.find(".J-alarmModule-resizeHeight")
				var bottomHeight = $module.find(".J-resize-item").height()
				var height = $(window).height();
				var padding = $height.parent().css("padding-top").toFloat();
				var top = $height.offset().top;
				var bottom = $(".bottomSubMenu").height();
				$height.height(Math.floor(height-top-bottom-bottomHeight-padding*4));
			})
		}
	});



	$module.find(".J-scroll").on("scrollDown",function () {
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