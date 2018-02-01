

$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "strategyModule";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			loading:false,
			params:{page_number:1,page_size:10,strategy_name:"",token:token}
		},
		watch: {
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number":function (newValue, oldValue) {
				if(newValue!=oldValue){
					if(this.params.page_number!=1){
						this.params.page_number =1;
					}else{
						this.refreshList();
					}

				}
			},
			"params.strategy_name":function (newValue, oldValue) {
				if(newValue!=oldValue){
					this.refreshList();
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
				// ### 7.5 查询策略列表
				// |  POST  |  smart_lock/v1/strategy/find_list |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  strategy_name | String | 否 | 策略名称  |  |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				var $$vue = this;
				var url = "/smart_lock/v1/strategy/find_list";
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

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number*1
						});

					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},

			saveAdd:function (index) {

			},
			// ### 6.2 更新角色
			// |  POST  |  /smart_lock/v1/strategy_mode/modify  |
			// | ------------- |:-------------:|

			saveModify:function (index) {

				var $$vue = this;
				var url =  "/smart_lock/v1/strategy_mode/modify";
				var type = "post";

				if(!$$vue.list[index].new_strategy_name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {strategy_id: this.list[index].id,strategy_name: this.list[index].new_strategy_name, token: token},
					success: function (ret) {
						$$vue.list[index].strategy_name = $$vue.list[index].new_strategy_name;
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
				var url = "/smart_lock/v1/strategy/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {strategy_id: $$vue.list[index].id, token: token},
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

			},
			cancelAdd: function (index) {
				this.del(index);
			},
			modify:function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_strategy_name = this.list[index].strategy_name;
				this.$forceUpdate()
			},
			cancelModify:function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
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
				$module = $("#"+moduleId);
				this.initEvent();
			})
		}
	});


	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
			$module=null
		}
	})
});