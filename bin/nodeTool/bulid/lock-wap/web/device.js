

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moudleId = "deviceMoudle";
	var moudleVueId = moudleId+"Vue";
	var $moudle = $("#"+moudleId);

	var $$vue = new Vue({
		el: "#"+moudleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,device_name:"",device_code:"",token:token}
		},
		watch: {

			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number":function (newValue, oldValue) {
				if(newValue!=oldValue){
					this.refreshList();
				}
			}
		},
		filters: {

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
			// ### 4.5 查询设备列表
			// |  POST  |  smart_lock/v1/device/find_list  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- |: -------- | -------- | -------- | ---- |
			// | page_size | Interger | 是 | 每页数量 | |
			// |page_number | Interger |是 | 页数 ||
			// | device_name | String | 否 | 设备名称| |
			// | device_code | String | 否 | 设备编码 | |
				var $$vue = this;
				var url = "/smart_lock/v1/device/find_list";
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

			del:function (index) {
				var $$vue = this;
				if(!$$vue.list[index].id){
					$$vue.list.splice(index,1);
					return;
				}
				var url =  "/smart_lock/v1/user/delete";
				var type = "post";
				var str = [
					'<div class="form-group J-validItem validItem">',
					'<label ><i class="t-danger fa-asterisk mr5 fs10"></i>手机验证码</label>',
					'<i class="fa-comment-o"></i>',
					// '<a class="btn btn-warning btn-send-code J-getMobileCode"><span class="text-gradient">发送验证码</span></a>',
					'<input type="text" class="form-control" name="sms_code" placeholder="请输入手机验证码!" check-type="required" data-focus="true">',
					'</div>'
				].join("");
				var $dialog = $.dialog(str, {
					title: "删除记录",
					width:400,
					button: [{
						text: "确认", click: function () {

								PAGE.ajax({
									url: url,
									type: type,
									data: {user_id: $$vue.list[index].id, token: token},
									success: function () {
										$$vue.list.splice(index,1);
									}
								});

						}
					}, {
						text: "取消", click: function () {

						}
					}]

				});
				// this.initSendCode($dialog)
			},
			// initSendCode:function ($form) {
			//
			// 	//发送短信验证码
			// 	$form.find(".J-getMobileCode").click(function () {
			// 		var $this =$(this);
			// 		if($this.data("lock") || $this.data("lock-text")){
			// 			return ;
			// 		}
			// 		var mobile = $form.find("input[name='phone']").val();
			// 		var captcha_code =  $form.find("input[name='captcha_code']").val();
			// 		if(!/^\d{11,}$/.test($.trim(mobile))){
			// 			$form.find("input[name='phone']").focus().parents(".J-validItem").removeClass("validSuccess").addClass("validError").find(".J-valid-msg").html("请填写正确的手机号");
			// 			return ;
			// 		}
			// 		if(!captcha_code){
			// 			$form.find("input[name='captcha_code']").parents(".J-validItem").removeClass("validSuccess").addClass("validError").find(".J-valid-msg").html("请填写正确的图形验证码")
			// 			return ;
			// 		}
			// 		$this.data("lock",true).data("lock-text",true);
			// 		var $text =$this.find(".text-gradient");
			//
			// 		if(!$text.data("origin-text")){
			// 			$text.data("origin-text",$text.html());
			// 		}
			// 		var originText = $text.data("origin-text");
			// 		$text.data("text",60).html(60);
			//
			// 		PAGE.ajax({type:"post",
			// 			data:{sms_type:"register",phone:mobile,captcha_code:captcha_code},
			// 			url:"/smart_lock/v1/member/sms",
			// 			success:function () {
			// 				$.tips("发送成功","success");
			// 				timoutCount($text,60,function(){
			// 					$text.data("text",originText).html(originText);
			// 					$this.data("lock-text",false);
			// 				});
			// 			},complete:function () {
			// 				$this.data("lock",false);
			// 			},errorCallBack:function () {
			// 				$this.data("lock-text",false);
			// 				$text.data("text",originText).html(originText);
			// 			}});
			// 	});
			//
			// 	function timoutCount($text,time,callback) {
			// 		time--;
			// 		$text.data("text",time).html(time);
			// 		if(time<=0){
			// 			if(typeof callback=="function"){
			// 				callback()
			// 			}
			// 		}else{
			// 			setTimeout(timoutCount,1000,$text,time,callback)
			// 		}
			// 	}
			// },
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
				this.list[index].new_device_name = this.list[index].name;
				this.list[index].new_device_model = this.list[index].device_model;
				this.$forceUpdate()
			},
			cancelModify:function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
	// 		### 4.6 修改设备信息
	// |  POST  |  smart_lock/v1/device/modify  |
	// | ------------- |:-------------:|
	//
	// **请求参数：**
	//
	// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
	// |  -------- | -------- | -------- | -------- | ---- |
	// |  device_id | Interger | 是 |  设备id  |  |
	// | device_name | String | 否 | 设备名称 | |
	// | device_model | String | 否|设备型号 | |
			saveModify:function (index) {
				var $$vue = this;
				var url =  "/smart_lock/v1/device/modify";
				var type = "post";

				if(!$$vue.list[index].new_device_name){
					$.tips("请输入设备名","warn");
					return;
				}
				if(!$$vue.list[index].new_device_model){
					$.tips("请输入设备型号","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {device_name: $$vue.list[index].new_device_name, device_id: $$vue.list[index].id,device_model:$$vue.list[index].new_device_model, token: token},
					success: function (ret) {
						$$vue.list[index].edit="";
						$$vue.list[index].name = $$vue.list[index].new_device_name;
						$$vue.list[index].device_model = $$vue.list[index].new_device_model;
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