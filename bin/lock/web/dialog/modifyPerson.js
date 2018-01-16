
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var $form = $("#addPerson")
	var $dialog = $form.parents(".dl-dialog");
	var listMap = [];

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var user_id;
	if ($triggerBtn && $triggerBtn.length) {
		user_id = $triggerBtn.data("user_id");
	}
	//表单注册
	$form.validForm({
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
				data:$form.serialize()+"&user_id="+user_id+"&token="+token,
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

	// //添加角色
	// var $$vue = new Vue({
	// 	el:"#addPerson_roleList",
	// 	data:{
	// 		list:[],
	// 		loading:false,
	// 		total_page:0,
	// 		params:{page_number:1,page_size:20,role_name:"",token:token}
	// 	},
	// 	methods:{
	// 		mergeArray:function (obj) {
	// 			if(typeof obj !== "object") {
	// 				return [];
	// 			};
	// 			var arr = [];
	// 			for(var no in obj) {
	// 				if($.type(obj[no]) != "array") {
	// 					//console.error("mergeObject", no, "is not array!");
	// 					continue;
	// 				}
	// 				arr = arr.concat(obj[no]);
	// 			}
	// 			return arr;
	// 		},
	// 		stopPropagation:function (e) {
	// 			e = e||window.event;
	// 			if(e.stopPropagation){
	// 				e.stopPropagation()
	// 			}else if(e.cancelBubble){
	// 				e.cancelBubble =false
	// 			}
	// 		},
	// 		getNextPageRole:function () {
	// 			if(!this.total_page){
	// 				return;
	// 			}
	// 			if(this.params.page_number<this.total_page){
	// 				this.params.page_number++;
	// 				this.getRole();
	// 			}
	//
	// 		},
	// 		getRole:function () {
	// 			var $$vue = this;
	// 			var url = "/smart_lock/v1/role/find_list";
	// 			var type = "post";
	// 			$$vue.loading = true;
	// 			PAGE.ajax({url:url,type:type,data:$$vue.params,success:function (ret) {
	// 				if( !ret ){
	// 					return;
	// 				}
	// 				if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
	// 					$.tips("请先添加角色","warn",function () {
	// 						window.location.hash="#/web/roleList.html";
	// 					});
	// 				}
	// 				listMap[$$vue.params.page_number] = ret.list;
	// 				$$vue.total_page = ret.total_page;
	// 				$$vue.list = $$vue.mergeArray(listMap);
	// 			},complete:function () {
	// 				$$vue.loading = false;
	// 			}});
	// 		},
	// 		// 		### 2.3 查询用户信息
	// 		// |  POST  |  smart_lock/v1/user/find  |
	// 		// | ------------- |:-------------:|
	// 		//
	// 		// **请求参数：**
	// 		//
	// 		// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
	// 		// |  -------- | -------- | -------- | -------- | ---- |
	// 		// |  token | string | 是 | 用户登录的token |  |
	// 		// |  user_id| INterger |是 | 用户id | |
	// 		getDetail:function () {
	// 			$moudle.addClass("loading");
	// 			var $$vue = this;
	// 			var url = "/smart_lock/v1/user/find";
	// 			var type = "post";
	// 			PAGE.ajax({url:url,type:type,data:$$vue.params,success:function (ret) {
	// 				if( !ret ){
	// 					return;
	// 				}
	// 				for(var key in ret){
	// 					if(key=="role_id"){
	//
	// 					}else{
	// 						$moudle.find("input[name='"+key+"']").val(ret[key]);
	// 					}
	// 				}
	// 			},complete:function () {
	// 				$moudle.removeClass("loading");
	// 			}});
	// 		}
	// 	},
	//
	// 	mounted: function () {
	// 		this.$nextTick(function () {
	// 			this.getRole();
	// 			this.getDetail();
	// 		})
	// 	}
	// });
	//
	// $dialog.find(".J-scroll").on("scrollDown",function () {
	// 	if(!$$vue.loading){
	// 		$$vue.getNextPageRole();
	// 	}
	// });

	// //窗口关闭时调用
	// $dialog[0].destory = function () {
	// 	if($$vue){
	// 		$$vue.$destroy();
	// 		$form = null;
	// 		$$vue = null;
	// 		listMap = null;
	// 		$dialog = null;
	// 	}
	// }
});