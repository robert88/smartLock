
$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "personHistory";
	var moduleVueId = moduleId+"Vue";
	var $module = $("#"+moduleId);

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,user_name:"",token:token}
		},
		watch: {
		//	list: {
		//		handler: function (newValue, oldValue) {
		//			if(this.edit){
		//				return;
		//			}
		//			for (var i = 0; i < newValue.length; i++) {
//
		//				//将请求字段统一使用role_name
		//				if (newValue[i].role_name !=  newValue[i].name) {
		//					newValue[i].role_name = newValue[i].name
		//				}
	//				}
		//		},
		//		deep: true
		//	},
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number":function (newValue, oldValue) {
				if(newValue!=oldValue){
					this.refreshList();
				}
			},
			"params.role_name":function (newValue, oldValue) {
				if(newValue!=oldValue){
					if(this.params.page_number!=1){
						this.params.page_number =1;
					}else{
						this.refreshList();
					}
				}
			}
		},
		filters: {
			role:function (value) {
				switch (value){
					case 10:
						return "超级管理员"
						break;
					case 11:
						return "普通管理员"
						break;
					default:
						return "普通人员"
						break;
				}
			},
			type:function (value) {
				switch (value){
					case 1:
						return "开门"
						break;
					case 2:
						return "关门"
						break;
					default:
						return "更新密码"
						break;
				}
			},
		},
		methods:{
			filter:function () {
				$module.find(".search-filter-wrap").toggleClass("open");
			},
			isSelf:function (email) {
				if(email&&(email==curAccordEmail)){
					return false;
				}
				return true;
			},
			refreshList:function () {
				// ### 2.13 查询删除用户列表
				// |  POST  |  smart_lock/v1/user/find_delete_list  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  userId_name | string | 否 |  客户名称  |  |
				// | page_size | Interger | 是 | 每页数量 | |
				// | page_number | Interger |是 | 页数 ||
				var $$vue = this;
				var url = "/smart_lock/v1/user/find_delete_list";
				var type = "post";
				PAGE.ajax({
					url: url, data: this.params, type: type, success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
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

			revert:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/user/recover_user";
				var type = "post";
				$.dialog("是否要恢复用户？", {
					title: "恢复用户",
					width:400,
					button: [{
						text: "确认", click: function () {
							if($$vue.list[index].id){
								PAGE.ajax({
									url: url,
									type: type,
									data: {user_id: $$vue.list[index].id, token: token},
									success: function () {
										$$vue.list.splice(index,1);
										//本地删除最后一个，兼容分页情况
										if($$vue.list.length==0){
											$$vue.refreshList();
										}
									}
								});
							}else{
								$$vue.list.splice(index,1);
							}

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
			})
		}
	});

	$module.parents(".tab-content-item").on("updateContent",function () {
		$$vue.refreshList();
	});

	$module.on("update",function () {
		$$vue.refreshList();
	});
	$module.on("click",".J-filter",function () {
		$$vue.filter();
	})
	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
			$module=null
		}
	})
});