

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}

	var moudleId = "authUserMoudle";
	var moudleVueId = moudleId+"Vue";
	var $moudle = $("#"+moudleId);
	var $dialog = $moudle.parents(".dl-dialog");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var user_id;
	if ($triggerBtn && $triggerBtn.length) {
		user_id = $triggerBtn.data("user_id");
	}

	var $$vue = new Vue({
		el: "#"+moudleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,user_id:user_id,token:token}
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
				$moudle.find(".search-filter-wrap").toggleClass("open");
			},
			refreshList:function () {
				// ### 4.11 查询某用户未授权设备列表
				// |  POST  |  smart_lock/v1/device/find_unauth_device  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- |: -------- | -------- | -------- | ---- |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				// | user_id | Interger | 是 | 用户id| |
				//
				// **ps 返回该用户有控制权限的设备 **
				// **返回**


				var $$vue = this;
				var url = "/smart_lock/v1/device/find_auth_device";
				var type = "post";
				PAGE.ajax({
					url: url, data: this.params, type: type, success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;
						$dialog.trigger("setcenter");
						PAGE.setpageFooter($moudle.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
					}
				});
			},
			cancelAuth:function (index) {
				// ### 4.9 取消设备授权设备给某个用户
				// |  POST  |  smart_lock/v1/device/delete_auth |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_ids  | String   | 是 | 设备id集合，逗号分割  |  |
				// | user_id | Interger | 是 | 用户id | |
				var $$vue = this;
				var url = "/smart_lock/v1/device/delete_auth";
				var type = "post";
				PAGE.ajax({
					url: url, data: {device_ids:$$vue.list[index].id,user_id:user_id}, type: type, success: function (ret) {
						$.tips("取消设备授权成功！","success");
						$$vue.list.splice(index,1);
						
					}
				});
			}
			// 		### 2.2 删除用户
			// // |  POST  |  smart_lock/v1/user/delete  |
			// // | ------------- |:-------------:|
			// //
			// // **请求参数：**
			// //
			// // |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// // |  -------- | -------- | -------- | -------- | ---- |
			// // |  token | string | 是 | 用户登录的token |  |
			// // |  user_id | Interger | 是 |  用户id  | 整形 |
			//
			// del:function (index) {
			// 	var $$vue = this;
			// 	var url =  "/smart_lock/v1/user/delete";
			// 	var type = "post";
			// 	$.dialog("是否要删除该记录？", {
			// 		title: "删除记录",
			// 		width:400,
			// 		button: [{
			// 			text: "确认", click: function () {
			// 				if($$vue.list[index].id){
			// 					PAGE.ajax({
			// 						url: url,
			// 						type: type,
			// 						data: {user_id: $$vue.list[index].id, token: token},
			// 						success: function () {
			// 							$$vue.list.splice(index,1);
			// 						}
			// 					});
			// 				}else{
			// 					$$vue.list.splice(index,1);
			// 				}
			//
			// 			}
			// 		}, {
			// 			text: "取消", click: function () {
			//
			// 			}
			// 		}]
			//
			// 	})
			// },
			// add:function () {
			// 	this.list.unshift({
			// 		edit: "add",
			// 		role_name: "",
			// 		name:"",
			// 		new_role_name:"",
			// 		is_admin: 12
			// 	})
			// },
			// saveAdd:function (index) {
			// 	var $$vue = this;
			// 	var url =  "/smart_lock/v1/role/add";
			// 	var type = "post";
			// 	this.list[index].role_name = this.list[index].name = this.list[index].new_role_name;
			// 	if(!this.list[index].name){
			// 		$.tips("请输入角色名","warn");
			// 		return;
			// 	}
			// 	PAGE.ajax({
			// 		url: url,
			// 		type: type,
			// 		data: {role_name: this.list[index].name, is_admin: this.list[index].is_admin, token: token},
			// 		success: function (ret) {
			// 			$.tips("保存成功！","success");
			// 			$$vue.list[index].edit="";
			// 			$$vue.list[index].id=ret.id;
			// 		}
			// 	});
			// },
			// canselAdd:function (index) {
			// 	this.del(index);
			// },
			// modify:function (index) {
			// 	this.list[index].edit = "modify";
			// 	this.list[index].new_role_name = this.list[index].name;
			// 	this.$forceUpdate()
			// },
			// cancelModify:function (index) {
			// 	this.list[index].edit = "";
			// 	this.$forceUpdate()
			// },
			// saveModify:function (index) {
			// 	$.tips("wu api");
			// 	return;
			// 	var $$vue = this;
			// 	var url =  "/smart_lock/v1/role/add";
			// 	var type = "post";
			// 	this.list[index].role_name = this.list[index].name = this.list[index].new_role_name;
			// 	if(!this.list[index].name){
			// 		$.tips("请输入角色名","warn");
			// 		return;
			// 	}
			// 	PAGE.ajax({
			// 		url: url,
			// 		type: type,
			// 		data: {role_name: this.list[index].name, is_admin: this.list[index].is_admin, token: token},
			// 		success: function (ret) {
			// 			$$vue.list[index].edit="";
			// 		}
			// 	});
			// }
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
			})
		}
	});

	// $moudle.parents(".tab-content-item").on("updateContent",function () {
	// 	$$vue.refreshList();
	// });
	//
	// $moudle.on("update",function () {
	// 	$$vue.refreshList();
	// });
	//
	// $moudle.on("click",".J-filter",function () {
	// 	$$vue.filter();
	// })


	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
			$moudle=null
		}
	})
});