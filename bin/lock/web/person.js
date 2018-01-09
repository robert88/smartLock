
$(function () {

	var token = PAGE.getToken();
		if(!token){
			return;
		}

	var $moudle = $("#systemPerson");

	var $$vue = new Vue({
		el: "#systemPerson-table",
		data: {
			list: [],
			params:{page_number:1,page_size:10,user_name:"",token:token}
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
			refreshList:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/user/find_list";
				var type = "post";
				PAGE.ajax({
					url: url, data: this.params, type: type, success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;

						PAGE.setpageFooter($moudle.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
					}
				});
			},
			saveAdd:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/role/add";
				var type = "post";
				this.list[index].name = this.role_name_template;
				this.list[index].is_admin = this.is_admin;
				if(!this.list[index].name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {role_name: this.list[index].name, is_admin: this.list[index].is_admin ? 11 : 12, token: token},
					success: function (ret) {
						$.tips("保存成功！","success");
						$$vue.list[index].status="";
					}
				});
			},
			saveModify:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/role/add";
				var type = "post";
				PAGE.ajax({
					url: url,
					type: type,
					data: {role_name: this.list[index].role_name, is_admin: this.list[index].is_admin ? 11 : 12, token: token},
					success: function (ret) {
						$$vue.list[index].status="";
						$$vue.list[index].role_id = ret.role_id;
						$$vue.list[index].role_name = ret.role_name;
						$$vue.list[index].consumer_id = ret.consumer_id;
					}
				});
			},
			del:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/user/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width:400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {role_id: this.list[index].role_id, token: token},
								success: function () {
									$$vue.list.splice(index,1);
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
				this.list.push({
					status: "add",
					role_name: "",
					is_admin: "",
					update_time: ""
				})
			},
			modify:function (index) {
				this.list[index].status = "modify";
				this.$forceUpdate()
			},
			filter:function () {
				$moudle.find(".search-filter-wrap").toggleClass("open");
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
			})
		}
	});

	$moudle.on("update",function () {
		$$vue.refreshList();
	})

});