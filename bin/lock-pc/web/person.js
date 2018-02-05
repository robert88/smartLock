$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "systemPerson";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,user_name:"",token:token}
		},
		watch: {
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					this.refreshList();
				}
			},
			"params.user_name":function (newValue, oldValue) {
				if(newValue!=oldValue){
					//当值改变了且当前页不是第一页设置第一页
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
			isSelf:function (email) {
				if(email&&(email==curAccordEmail)){
					return false;
				}
				return true;
			},
			refreshList:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/user/find_list";
				var type = "post";
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: this.params,
					type: type,
					success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list||[];

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number*1
						});

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
				//新增的数据直接删除
				if (!$$vue.list[index].id) {
					$$vue.list.splice(index, 1);
					return;
				}
				var url =  "/smart_lock/v1/user/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {user_id: $$vue.list[index].id, token: token},
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
			},
			add: function () {

			},
			cancelAdd: function (index) {

			},
			modify: function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_role_name = this.list[index].name;
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
			$module=null
		}
	})
});