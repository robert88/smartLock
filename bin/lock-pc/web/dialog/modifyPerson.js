
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var moduleId = "modifyPerson";
	var moduleVueId = moduleId+"Vue";
	var $module = $("#"+moduleId);
	var $dialog = $module.parents(".dl-dialog");
	var listMap = [];

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var user_id;
	if ($triggerBtn && $triggerBtn.length) {
		user_id = $triggerBtn.data("user_id");
	}
	//表单注册
	$module.validForm({
		success:function ($btn) {
			// ### 2.4 修改用户信息
			// |  POST  |  smart_lock/v1/user/modify  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  token | string | 是 | 用户登录的token |  |
			// |  user_id | Interger | 是 |  用户id  | 整形 |
			// |  user_name | String | 否 | 用户昵称 | 长度必须小于30 |
			// |  user_phone | String | 否 | 账户用户手机号 | 必须是纯数字，长度最少11位，小于20位 |
			// |  role_id | Integer | 否 | 角色ID | 如果账户类型是超级管理员，该值默认填-1,切不可更改 |
			PAGE.ajax({
				data:$module.serialize()+"&user_id="+user_id+"&token="+token,
				type:'post',
				url:"/smart_lock/v1/user/modify",
				success:function (ret) {
					$.dialog.closeAll();
					$.tips("修改成功！","success");
					$("#systemPerson").trigger("update");
				}
			})
		}
	});

	//添加角色
	var $$vue = new Vue({
		el:"#"+moduleVueId,
		data:{
			list:[],
			loading:false,
			total_page:0,
			params:{page_number:1,page_size:20,role_name:"",token:token},
			userParams:{user_id:user_id,token:token}
		},
		methods:{
			mergeArray:function (obj) {
				if(typeof obj !== "object") {
					return [];
				};
				var arr = [];
				for(var no in obj) {
					if($.type(obj[no]) != "array") {
						//console.error("mergeObject", no, "is not array!");
						continue;
					}
					arr = arr.concat(obj[no]);
				}
				return arr;
			},
			stopPropagation:function (e) {
				e = e||window.event;
				if(e.stopPropagation){
					e.stopPropagation()
				}else if(e.cancelBubble){
					e.cancelBubble =false
				}
			},
			getNextPageRole:function () {
				if(!this.total_page){
					return;
				}
				if(this.params.page_number<this.total_page){
					this.params.page_number++;
					this.getRole();
				}

			},
			getDetail:function () {
				$module.addClass("loading");
				var $$vue = this;
				var url = "/smart_lock/v1/user/find";
				var type = "post";
				PAGE.ajax({url:url,type:type,data:$$vue.userParams,success:function (ret) {
					if( !ret ){
						return;
					}
					$$vue.userInfo = {
						"id": ret.role_id,
						"name": "维持当前角色"
					};
					$$vue.list.push($$vue.userInfo);
					$$vue.setInputValue("user_name",ret.user_name,$module);
					$$vue.setInputValue("user_phone",ret.user_phone,$module);
					$$vue.setSelectValue("role_id",ret.role_id,$module);

				},complete:function () {
					$module.removeClass("loading");
				}});
			},
			getRole:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/role/find_list";
				var type = "post";
				$$vue.loading = true;
				PAGE.ajax({
					async:false,
					url:url,
					type:type,
					data:$$vue.params,success:function (ret) {
					if( !ret ){
						return;
					}
					if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
						$.tips("请先添加角色","warn",function () {
							window.location.href="/#/web/roleList.html";
						});
					}
					listMap[$$vue.params.page_number] = ret.list;
					$$vue.total_page = ret.total_page;
					$$vue.list = $$vue.mergeArray(listMap);
					if($$vue.userInfo){
						$$vue.list.push($$vue.userInfo)
					}
					
				},complete:function () {
					$$vue.loading = false;
				}});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.getRole();
				this.getDetail();
			})
		}
	});

	$dialog.find(".J-scroll").on("scrollDown",function () {
		if(!$$vue.loading){
			$$vue.getNextPageRole();
		}
	});
	//窗口关闭时调用
	$dialog[0].destroy = function () {
		if($$vue){
			$$vue.$destroy();
			$module = null;
			$$vue = null;
			listMap = null;
			$dialog = null;
		}
	}
});