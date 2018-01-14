$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}

	var $moudle = $("#roleList");

	var $$vue = new Vue({
		el: "#roleList",
		data: {
			list: [],
			params:{page_number:1,page_size:10,role_name:"",token:token}
		},
		watch: {
			list: {
				handler: function (newValue, oldValue) {
					if(this.edit){
						return;
					}
					for (var i = 0; i < newValue.length; i++) {

						//将请求字段统一使用role_name
						if (newValue[i].role_name !=  newValue[i].name) {
							newValue[i].role_name = newValue[i].name
						}
					}
				},
				deep: true
			},
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
			isAdmin: function (value) {
				switch (value) {
					case 11:
						return true
						break;
					default:
						return false
						break;
				}
			},
		},
		methods:{
			refreshList:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/role/find_list";
				var type = "post";
				PAGE.ajax({
					url: url, data: this.params, type: type, success: function (ret) {
						if (!ret ) {
							return;
						}

						$$vue.list = ret.list||[];

						PAGE.setpageFooter($moudle.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number*1
						});
					}
				});
			},
			del:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/role/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width:400,
					button: [{
						text: "确认", click: function () {
						    if($$vue.list[index].id){
						        PAGE.ajax({
                                    url: url,
                                    type: type,
                                    data: {role_id: $$vue.list[index].id, token: token},
                                    success: function () {
                                        $$vue.list.splice(index,1);
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
			},
			add:function () {
				this.list.unshift({
					edit: "add",
					role_name: "",
					name:"",
					new_role_name:"",
					is_admin: 12
				})
			},
			saveAdd:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/role/add";
				var type = "post";
				this.list[index].role_name = this.list[index].name = this.list[index].new_role_name;
				if(!this.list[index].name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {role_name: this.list[index].name, is_admin: this.list[index].is_admin, token: token},
					success: function (ret) {
						$.tips("保存成功！","success");
						$$vue.list[index].edit="";
						$$vue.list[index].id=ret.id;
					}
				});
			},
			canselAdd:function (index) {
				this.del(index);
			},
			modify:function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_role_name = this.list[index].name;
				this.$forceUpdate()
			},
			cancelModify:function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
			saveModify:function (index) {
				$.tips("wu api");
				return;
				var $$vue = this;
				var url =  "/smart_lock/v1/role/add";
				var type = "post";
				this.list[index].role_name = this.list[index].name = this.list[index].new_role_name;
				if(!this.list[index].name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {role_name: this.list[index].name, is_admin: this.list[index].is_admin, token: token},
					success: function (ret) {
						$$vue.list[index].edit="";
					}
				});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$moudle = $("#roleList")
			})
		}
	});

	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
		}
	})
});