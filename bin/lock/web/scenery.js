$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moudleId = "sceneryMoudle";
	var moudleVueId = moudleId;
	var $moudle = $("#"+moudleId);

	var $$vue = new Vue({
		el: "#"+moudleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,situational_name:"",token:token}
		},
		watch: {
			list: {
				handler: function (newValue, oldValue) {
					if(this.edit){
						return;
					}
					for (var i = 0; i < newValue.length; i++) {

						//将请求字段统一使用situational_name
						if (newValue[i].situational_name !=  newValue[i].name) {
							newValue[i].situational_name = newValue[i].name
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
			filter:function () {
				$moudle.find(".search-filter-wrap").toggleClass("open");
			},
			isSelf:function (email) {
				if(email&&(email==curAccordEmail)){
					return false;
				}
				return true;
			},
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
					situational_name: "",
					name:"",
					new_situational_name:"",
					is_admin: 12
				})
			},
	// 	|  POST  |  smart_lock/v1/situational_mode/add|
	// 	| ------------- |:-------------:|
	//
	// **请求参数：**
	//
	// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
	// |  -------- | -------- | -------- | -------- | ---- |
	// |  situational_name | String | 是 | 情景模式名称  |  |
			saveAdd:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/situational_mode/add";
				var type = "post";
				this.list[index].situational_name = this.list[index].name = this.list[index].new_situational_name;
				if(!this.list[index].name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {situational_name: this.list[index].name, is_admin: this.list[index].is_admin, token: token},
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
				this.list[index].new_situational_name = this.list[index].name;
				this.$forceUpdate()
			},
			cancelModify:function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
			// ### 6.2 更新角色
			// |  POST  |  smart_lock/v1/role/modify  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  situational_name | String | 是 |  角色名称  | |
			// | role_id |  Interger | 是 | 角色ID | |
			// | token | String | 是 | 用户Token |示例：06REbYPmid30pL75pfauECjxFuYGx |
			saveModify:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/role/modify";
				var type = "post";
				this.list[index].situational_name = this.list[index].name = this.list[index].new_situational_name;
				if(!this.list[index].name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {situational_name: this.list[index].name, role_id: this.list[index].id, token: token},
					success: function (ret) {
						$$vue.list[index].edit="";
						$$vue.$forceUpdate();
						$.tips("修改成功！","success");
					}
				});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$moudle = $("#"+moudleId)
			})
		}
	});

	$moudle.parents(".tab-content-item").on("updateContent",function () {
		$$vue.refreshList();
	});

	$moudle.on("update",function () {
		$$vue.refreshList();
	});
	$moudle.on("click",".J-filter",function () {
		$$vue.filter();
	})
	PAGE.destroy.push(function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
			$moudle=null
		}
	})
});