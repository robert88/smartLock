$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "addStrategyForm";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var $dialog = $module.parents(".dl-dialog");
	var listMap = {};
	var $relativeModule = $("#strategyModule");//关联的模块
	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var strategy_id;
	if ($triggerBtn && $triggerBtn.length) {
		strategy_id = $triggerBtn.data("strategy_id");
	}

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

			strategy_params:{strategy_id:strategy_id,token:token},

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
					for(var i=0;i<=48;i++){
						if((i/2)>newValue){
							this.allow_end_time_list.push({name:i/2,id:i/2});
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
				for(var i=0;i<=48;i++){
					this.allow_start_time_list[i] = {name:i/2,id:i/2}
					this.allow_end_time_list[i] = {name:i/2,id:i/2}
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
					$$vue.list = $$vue.mergeArray(listMap["person"] );
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
						$$vue.list = $$vue.mergeArray(listMap["role"] );

					},
					complete: function () {
						$$vue.personLoading = false;
					}
				});
			},
			initSubmit:function () {
				// |  POST  |  smart_lock/v1/strategy/modify|
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  strategy_id | Interger | 是 | 策略id  |  |
				// |  strategy_name | String | 否 | 策略名称  |  |
				// | role_id | Interger | 否 | 有权限角色id | |
				// | user_id | Interger | 否 | 有权限用户id | |
				// | allow_time | String | 否 | 允许操作时间段 | 以0点开始，分为单位的时间段，如零点半到一点允许，即30_60 |
				// | allow_openmode | String | 否 |允许开锁方式 | 逗号隔开，11，12，13|
				// | allow_operation | String | 否 |允许的操作| 暂定开和关两种，开门：11，关门：12。如 11，12 即开和关都允许 |
				var $$vue = this;
				$module.validForm({
					success:function ($btn) {

						if($$vue.end_time<=$$vue.start_time){
							$.tips("允许操作结束时间必须大于开始时间！","error");
							return
						}
						PAGE.ajax({
							data:$module.serialize()+"&strategy_id="+strategy_id+"&allow_time="+$$vue.start_time*60+"_"+$$vue.end_time*60+"&token="+token,
							type:'post',
							url:"/smart_lock/v1/strategy/modify",
							success:function (ret) {
								$.dialog.closeAll();
								$.tips("修改成功！","success");
								$relativeModule.trigger("update");
							}
						})
					}
				});

			},
			getStrategy:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/strategy/find";
				var type = "post";
				$module.addClass("loading");
				PAGE.ajax({
					url: url,
					data: this.strategy_params,
					type: type,
					success: function (ret) {
						if (!ret) {
							return;
						}
						var allow_time = ret.allow_time.split("_")||[];
						$$vue.setInputValue("strategy_name",ret.name);
						$$vue.setSelectValueByName("role_name",ret.role_name);
						$$vue.setSelectValueByName("user_name",ret.user_name);
						$$vue.setSelectValue("start_time",Math.floor(allow_time[0]*10/60)/10);
						$$vue.setSelectValue("end_time",Math.floor(allow_time[1]*10/60)/10);
						$$vue.setSelectValue("allow_openmode",ret.allow_openmode);
						$$vue.setSelectValue("allow_operation",ret.allow_operation);
					},
					complete: function () {
						$module.removeClass("loading");
					}
				});
			},
			/**
			 *设置表单数据
			 * */
			setInputValue:function (name, value) {
				if (value != null && $module.find("input[name='" + name + "']").length) {
					$module.find("input[name='" + name + "']").val(value).addClass("ipt-not-empty");
				}
			},
			/**
			 *设置下拉菜单数据
			 * */
			setSelectValueByName:function (name, value) {
				var $input = $module.find("input[name='" + name + "']")
				if (value != null && $input.length) {
					if($input.parents(".J-mutil-select").length){
						$.each(value.split(","),function (index,val) {
							if(val){
								$input.parents(".J-select").find(".option[data-name='" + val + "']").click();
							}
						})
					}else{
						$input.parents(".J-select").find(".option[data-name='" + value + "']").click();
					}

				}
			},
			/**
			 *设置下拉菜单数据
			 * */
			setSelectValue:function (name, value) {
				var $input = $module.find("input[name='" + name + "']")
				if (value != null && $input.length) {
					if($input.parents(".J-mutil-select").length){
						$.each(value.split(","),function (index,val) {
							if(val){
								$input.parents(".J-select").find(".option[data-value='" + val + "']").click();
							}
						})
					}else{
						$input.parents(".J-select").find(".option[data-value='" + value + "']").click();
					}

				}
			}


		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshRoleList();
				this.refreshPersonList();
				this.initAllowTime();
				this.getStrategy();
				$module = $("#" + moduleId);
				this.initSubmit();
			})
		}
	});



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