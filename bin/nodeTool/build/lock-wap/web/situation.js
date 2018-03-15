$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "situationModule";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,situational_name:"",token:token}
		},
		watch: {
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number":function (newValue, oldValue) {
				if(newValue!=oldValue){
					this.refreshList();
				}
			},
			"params.situational_name":function (newValue, oldValue) {
				if(newValue!=oldValue){
					if(this.params.page_number!=1){
						this.params.page_number =1;
					}else{
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
	// 		### 8.6 查询情景模式列表
	// |  POST  |  smart_lock/v1/situational_mode/find_list|
	// | ------------- |:-------------:|
	//
	// **请求参数：**
	//
	// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
	// |  -------- | -------- | -------- | -------- | ---- |
	// |  situational_name | String | 否 | 情景模式名称  |  |
				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/find_list";
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
						if (!ret ) {
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
	// 	|  POST  |  smart_lock/v1/situational_mode/add|
	// 	| ------------- |:-------------:|
	//
	// **请求参数：**
	//
	// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
	// |  -------- | -------- | -------- | -------- | ---- |
	// |  situation_name | String | 是 | 情景模式名称  |  |
			saveAdd:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/situational_mode/add";
				var type = "post";
				
				if(!this.list[index].new_situation_name){
					$.tips("请输入情景名称！","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {situational_name: this.list[index].new_situation_name,  token: token},
					success: function (ret) {
						$.tips("保存成功！","success");
						$$vue.list[index].edit="";
						$$vue.list[index].situation_name = $$vue.list[index].new_situation_name;
						$$vue.list[index].id=ret.id;
					}
				});
			},
			// ### 6.2 更新角色
			// |  POST  |  /smart_lock/v1/situational_mode/modify  |
			// | ------------- |:-------------:|

			saveModify:function (index) {

				var $$vue = this;
				var url =  "/smart_lock/v1/situational_mode/modify";
				var type = "post";

				if(!$$vue.list[index].new_situation_name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {situational_id: this.list[index].id,situational_name: this.list[index].new_situation_name, token: token},
					success: function (ret) {
						$$vue.list[index].situation_name = $$vue.list[index].new_situation_name;
						$$vue.list[index].edit="";
						$$vue.$forceUpdate();
						$.tips("修改成功！","success");
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
				var url = "/smart_lock/v1/situational_mode/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {situational_id: $$vue.list[index].id, token: token},
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
			add:function () {
				this.list.unshift({
					edit: "add",
					situation_name: "",
					name:"",
					new_situation_name:"",
					is_admin: 12
				})
			},
			cancelAdd: function (index) {
				this.del(index);
			},
			modify:function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_situation_name = this.list[index].situation_name;
				this.$forceUpdate()
			},
			cancelModify:function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
			open_situational:function (index) {
				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/open_situational";
				var type = "post";
				$module.addClass("loading");
				PAGE.ajax({
					url: url,
					type: type,
					data: {situational_id: $$vue.list[index].id,token: token},
					success: function () {
						$$vue.refreshList();
					},
					complete:function () {
						$module.removeClass("loading");
					}
				});
			},
			delStrategy:function (index) {
				var $$vue = this;
				if($$vue.list[index].strategy_id){
					var url = "/smart_lock/v1/situational_mode/delete_strategy";
					var type = "post";
					$.dialog("是否要解除当前策略？", {
						title: "解除策略",
						width: 400,
						button: [{
							text: "确认", click: function () {
								PAGE.ajax({
									url: url,
									type: type,
									data: {situational_id: $$vue.list[index].id,strategy_id: $$vue.list[index].strategy_id,token: token},
									success: function () {
										$.tips("操作成功！", "success");
										$$vue.list[index].strategy_id=""
										$$vue.list[index].strategy_name=""
							
									}
								});

							}
						}, {
							text: "取消", click: function () {

							}
						}]

					})
				}
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

    $("body").on("scrollDown." + moduleId, function () {
        if (!$$vue.loading) {
            $$vue.getNextPage();
        }
    });

	PAGE.destroy.push(function () {
		if($$vue){
			$("body").off("scrollDown." + moduleId);
			$$vue.$destroy();
			$$vue = null;
			$module=null
		}
	})
});
