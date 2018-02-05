$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "sysLog";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params: {page_number: 1, page_size: 10, token: token}
		},
		watch: {
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					if (this.params.page_number != 1) {
						this.params.page_number = 1;
					} else {
						this.refreshList();
					}
				}
			},
			//"params.role_name": function (newValue, oldValue) {
		//		if(newValue!=oldValue){
			//		this.refreshList();
		//		}
		//	}
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
			refreshList: function () {
				var $$vue = this;
				var url = "/smart_lock/v1/operation_log/find_list";
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
				var $$vue = this;
				var url = "/smart_lock/v1/role/add";
				var type = "post";
				if (!$$vue.list[index].new_role_name) {
					$.tips("请输入角色名", "warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {
						role_name: $$vue.list[index].new_role_name,
						is_admin: $$vue.list[index].is_admin,
						token: token
					},
					success: function (ret) {
						$.tips("保存成功！", "success");
						$$vue.list[index].name = $$vue.list[index].new_role_name;
						$$vue.list[index].edit = "";
						if (ret && ret.role_id) {
							$$vue.list[index].id = ret.role_id;
						} else {
							$.tips("丢失id！", "warn");
						}
					}
				});
			},
			// ### 6.2 更新角色
			// |  POST  |  smart_lock/v1/role/modify  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  role_name | String | 是 |  角色名称  | |
			// | role_id |  Interger | 是 | 角色ID | |
			// | token | String | 是 | 用户Token |示例：06REbYPmid30pL75pfauECjxFuYGx |
			saveModify: function (index) {
				var $$vue = this;
				var url = "/smart_lock/v1/role/modify";
				var type = "post";
				if (!$$vue.list[index].new_role_name) {
					$.tips("请输入角色名", "warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {role_name: this.list[index].new_role_name, role_id: this.list[index].id, token: token},
					success: function (ret) {
						$$vue.list[index].edit = "";
						$$vue.list[index].name = $$vue.list[index].new_role_name;
						$$vue.$forceUpdate();
						$.tips("修改成功！", "success");
					}
				});
			},
			del: function (index) {

				var $$vue = this;
				//新增的数据直接删除
				if (!$$vue.list[index].id) {
					$$vue.list.splice(index, 1);
					return;
				}
				var url = "/smart_lock/v1/role/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {role_id: $$vue.list[index].id, token: token},
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
				this.list.unshift({
					edit: "add",
					name: "",
					new_role_name: "",
					is_admin: 12
				})
			},
			cancelAdd: function (index) {
				this.del(index);
			},
			modify: function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_role_name = this.list[index].name;
				this.$forceUpdate()
			},
			cancelModify: function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
			initEvent:function ($module) {
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
				$module = $("#"+moduleId)
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
		if($$vue){
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module=null
		}
	})
});