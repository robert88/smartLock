$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "addStrategyForm";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = {};
	var $relativeModule = $("#strategyModule");//关联的模块

	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			role_list: [],
			roleLoading:false,
			roleTotalPage:0,
			role_params: {page_number: 1, page_size: 10, role_name: "",  token: token},

			person_list:[],
			personLoading:false,
			personTotalPage:0,
			person_list_params:{page_number:1,page_size:10,user_name:"",token:token},

			allow_start_time_list:[],
			allow_end_time_list:[],
			start_time:0,
			end_time:0,
			allow_openmode_list:[{id:"11",name:"远程控制"},{id:"12",name:"密码"}],
			allow_operation_list:[{id:"11",name:"开门"},{id:"12",name:"关门"}]
		},
		watch: {
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
			"person_list_params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					if (this.person_list_params.page_number != 1) {
						this.person_list_params.page_number = 1;
					} else {
						this.refreshList();
					}
				}
			},
			"start_time": function (newValue, oldValue) {
				if (newValue != oldValue) {
					this.allow_end_time_list =[];
					var curTime = new Date("2018/02/04").getTime();

					for(var i=0;i<=48;i++){
						if((i/2)>newValue){
							if(i==48){
								this.allow_end_time_list.push({name:"24:00",id:i/2});
							}else{
								this.allow_end_time_list.push({name:(curTime+i/2*60*60*1000).toString().toDate().format("hh:mm"),id:i/2});
							}
						}

					}
				}
			}
		},
		methods: {
			mergeArray: function (obj) {
				if (typeof obj !== "object") {
					return [];
				}

				var arr = [];
				for (var no in obj) {
					if ($.type(obj[no]) != "array") {
						continue;
					}
					arr = arr.concat(obj[no]);
				}
				return arr;
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
			getPersonNextPage: function () {
				if (!this.personTotalPage) {
					return;
				}
				if (this.person_list_params.page_number < this.personTotalPage) {
					this.person_list_params.page_number++;
					this.refreshPersonList();
				}
			},
			filter: function () {
				$module.find(".search-filter-wrap").toggleClass("open");
			},
			isSelf: function (email) {
				if (email && (email == curAccordEmail)) {
					return false;
				}
				return true;
			},
			initAllowTime:function () {
				var curTime = new Date("2018/02/04").getTime();
				for(var i=0;i<=48;i++){
					if(i==48){
						this.allow_start_time_list[i] = {name:"24:00",id:i/2}
						this.allow_end_time_list[i] = {name:"24:00",id:i/2}
					}else{
						this.allow_start_time_list[i] = {name:(curTime+i/2*60*60*1000-turnTime).toString().toDate().format("hh:mm"),id:i/2}
						this.allow_end_time_list[i] = {name:(curTime+i/2*60*60*1000-turnTime).toString().toDate().format("hh:mm"),id:i/2}
					}
				}
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
							window.location.hash="#/web/roleList.html";
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
			refreshPersonList:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/user/find_list";
				var type = "post";
				if ($$vue.personLoading) {
					return;
				}
				$$vue.personLoading = true;
				PAGE.ajax({
					async:false,
					url: url,
					data: this.person_list_params,
					type: type,
					success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.person_list = ret.list||[];
						listMap["person"]  = listMap["person"] || [];
						listMap["person"] [$$vue.person_list_params.page_number] = ret.list;
						$$vue.personTotalPage = ret.total_page;
						$$vue.list = $$vue.mergeArray(listMap["person"] );

					},
					complete: function () {
						$$vue.personLoading = false;
					}
				});
			},
			initSubmit:function () {
				//表单注册
				var $$vue = this;
				$module.validForm({
					success:function ($btn) {

						if(($$vue.end_time*1)<=($$vue.start_time*1)){
							$.tips("允许操作结束时间必须大于开始时间！","error");
							return
						}
						PAGE.ajax({
							data:$module.serialize()+"&allow_time="+$$vue.start_time*60+"_"+$$vue.end_time*60+"&token="+token,
							type:'post',
							url:"/smart_lock/v1/strategy/add",
							success:function (ret) {
								$.dialog.closeAll();
								$.tips("添加成功！","success");
								$relativeModule.trigger("update");
							}
						})
					}
				});

			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshRoleList();
				this.refreshPersonList();
				this.initAllowTime();
				$module = $("#" + moduleId);
				this.initSubmit();

				$module.find(".J-scroll.role").on("scrollDown",function () {
					if(!$$vue.roleLoading){
						$$vue.getRoleNextPage();
					}
				});
				$module.find(".J-scroll.person").on("scrollDown",function () {
					if(!$$vue.personLoading){
						$$vue.getPersonNextPage();
					}
				});
			})
		}
	});



	PAGE.destroy.push(function () {
		if ($$vue) {
			$("body").off("scrollDown." + moduleId);
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module = null
		}
	})
})
;