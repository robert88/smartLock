$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "systemPerson";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = {};

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,user_name:"",email:"",phone:"",role_id:"",token:token},
			saveUserAjax:{url:"/smart_lock/v1/user/set_order",type:"get"},
			role_list: [],
			roleLoading:false,
			roleTotalPage:0,
			role_params: {page_number: 1, page_size: 10, role_name: "",  token: token},
		},
		watch: {
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					this.refreshList();
				}
			},

			// "params.user_name":function (newValue, oldValue) {
			// 	if(newValue!=oldValue){
			// 		//当值改变了且当前页不是第一页设置第一页
			// 		if (this.params.page_number != 1) {
			// 			this.params.page_number = 1;
			// 		} else {
			// 			this.refreshList();
			// 		}
			// 	}
			// },
			// "params.role_id":function (newValue, oldValue) {
			// 	if(newValue!=oldValue){
			// 		//当值改变了且当前页不是第一页设置第一页
			// 		if (this.params.page_number != 1) {
			// 			this.params.page_number = 1;
			// 		} else {
			// 			this.refreshList();
			// 		}
			// 	}
			// },
			// "params.phone":function (newValue, oldValue) {
			// 	if(newValue!=oldValue){
			// 		//当值改变了且当前页不是第一页设置第一页
			// 		if (this.params.page_number != 1) {
			// 			this.params.page_number = 1;
			// 		} else {
			// 			this.refreshList();
			// 		}
			// 	}
			// },
			// "params.email":function (newValue, oldValue) {
			// 	if(newValue!=oldValue){
			// 		//当值改变了且当前页不是第一页设置第一页
			// 		if (this.params.page_number != 1) {
			// 			this.params.page_number = 1;
			// 		} else {
			// 			this.refreshList();
			// 		}
			// 	}
			// },
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"role_params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					if (this.role_params.page_number != 1) {
						this.role_params.page_number = 1;
					} else {
						this.refreshList();
					}
				}
			},
		},
		methods: {
			datadragEnd:function(evt){
				var $$vue = this;
				console.log('拖动前的索引：'+evt.oldIndex);
				console.log('拖动后的索引：'+evt.newIndex);
				var list;
			
				for(var i=0;i<$$vue.list.length;i++){
					list = $$vue.list[i]
					console.log(list.id,i,list.orders,list.orgOrders);
				}
				// return{page_number:$vue.page_number,token:token}
				// PAGE.ajax({
				// 	url: url,
				// 	data: {page_number:$$vue.page_number,token:token,orders:""},
				// 	type: type,
				// 	success: function (ret) {
				// 		if (!ret) {
				// 			return;
				// 		}
				//
				// 		ret.list = ret.list||[];
				// 		$.each(ret.list,function (idx) {
				// 			ret.list[idx].orders = idx;
				// 			ret.list[idx].orgOrders = idx;
				// 		});
				// 		$$vue.list = ret.list;
				// 		PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
				// 			$$vue.params.page_number = page_number*1
				// 		});
				//
				// 	},
				// 	complete: function () {
				// 		$$vue.loading = false;
				// 	}
				// });
			},
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
						
						ret.list = ret.list||[];
						$.each(ret.list,function (idx) {
							ret.list[idx].orders = idx;
							ret.list[idx].orgOrders = idx;
						});
						$$vue.list = ret.list;
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
			},
			refreshRoleList:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/role/find_list";
				var type = "post";
				$$vue.loading = true;
				PAGE.ajax({url:url,
					async:false,
					type:type,
					data:$$vue.role_params,
					success:function (ret) {
						if( !ret ){
							return;
						}
						if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
							$.tips("请先添加角色","warn",function () {
								window.location.href="/#/web/roleList.html";
							});
						}
						$$vue.role_list = ret.list||[];
						listMap["role"]  = listMap["role"] || [];
						listMap["role"] [$$vue.role_params.page_number] = ret.list;
						$$vue.roleTotalPage = ret.total_page;
						$$vue.list = $$vue.mergeArray(listMap["role"] );
					},complete:function () {
						$$vue.loading = false;
					}});
			},			
			getRoleNextPage: function () {
				if (!this.roleTotalPage) {
					return;
				}
				if (this.role_params.page_number < this.roleTotalPage) {
					this.role_params.page_number++;
					this.refreshRoleList();
				}
			},

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				this.refreshRoleList();
				$module = $("#"+moduleId)
				this.initEvent($module);
				$module.find(".J-scroll.role").on("scrollDown",function () {
					if(!$$vue.roleLoading){
						$$vue.getRoleNextPage();
					}
				});
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