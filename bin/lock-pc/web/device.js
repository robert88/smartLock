$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "deviceModule";
	var moduleVueId = moduleId;
	var $module = $("#" + moduleId);
	var listMap = [];


	var $$vue = new Vue({
		el: "#" + moduleVueId,
		data: {
			list: [],
			params: {page_number: 1, page_size: 10, device_name: "", device_code: "", token: token},

			list2:[],
			loading2:false,
			total_page2:0,
			params2:{page_number:1,page_size:20,group_name:"",token:token}
		},
		watch: {

			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number": function (newValue, oldValue) {
				if (newValue != oldValue) {
					this.refreshList();
				}
			},
			"params.device_name": function (newValue, oldValue) {
				if (newValue != oldValue) {
					if (this.params.page_number != 1) {
						this.params.page_number = 1;
					} else {
						this.refreshList();
					}
				}
			}
		},
		methods: {
			mergeArray: function (obj) {
				if (typeof obj !== "object") {
					return [];
				}
				;
				var arr = [];
				for (var no in obj) {
					if ($.type(obj[no]) != "array") {
						continue;
					}
					arr = arr.concat(obj[no]);
				}
				return arr;
			},
			getNextPage: function () {
				if (!this.total_page) {
					return;
				}
				if (this.params.page_number < this.total_page) {
					this.params.page_number++;
					this.refreshList();
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
			refreshList: function () {
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
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: $$vue.params,
					type: type,
					success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
					},
					complete:function(){
						$$vue.loading = false;
					}
				});
			},
			saveAdd: function (index) {

			},
			saveModify: function (index) {
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
				var $$vue = this;
				var url = "/smart_lock/v1/device/modify";
				var type = "post";

				if (!$$vue.list[index].new_device_name) {
					$.tips("请输入设备名", "warn");
					return;
				}


				var new_group_id = $module.find(".J-select-value"+index).val();
				var new_group_name = $module.find(".J-select-text"+index).val();

				PAGE.ajax({
					url: url,
					type: type,
					data: {
						device_name: $$vue.list[index].new_device_name,
						device_id: $$vue.list[index].id,
						group_id:new_group_id||0,
						device_model: $$vue.list[index].new_device_mode,
						token: token
					},
					success: function (ret) {
						$$vue.list[index].edit = "";
						$$vue.list[index].device_name = $$vue.list[index].new_device_name;
						$$vue.list[index].device_mode = $$vue.list[index].new_device_mode;
						$$vue.list[index].group_name = new_group_name;

						$$vue.$forceUpdate();
						$.tips("修改成功！", "success");
					}
				});
			},

			del: function (index) {
				// ### 4.7 删除设备
				// |  POST  |  smart_lock/v1/device/delete  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  device_id | Interger | 是 |  设备id  | 会走手机验证流程 |
				// |  code | string | 是 |  短信验证码  |  |
				// |  token | string | 是 |  用户登录的token  |  |
				// |  phone | string | 是 |  上一步获得的加密手机号  |  |
				var $$vue = this;
				if (!$$vue.list[index].id) {
					$$vue.list.splice(index, 1);
					return;
				}

				function changeImage(){
					PAGE.ajax({
						url:"/smart_lock/v1/member/captcha",
						type:"get",
						success:function (data) {
							if(data){
								$captcha[0].src = data.src;
							}
						}
					})
				}
				function timoutCount($text,time,callback) {
					time--;
					$text.data("text",time).html(time);
					if(time<=0){
						if(typeof callback=="function"){
							callback()
						}
					}else{
						setTimeout(timoutCount,1000,$text,time,callback)
					}
				}


				var url = "/smart_lock/v1/device/delete";
				var type = "post";
				var str = [
					'<div class="form-group J-validItem validItem">',
					'<label ><i class="t-danger fa-asterisk mr5 fs10"></i>图形验证码</label>',
					'<i class="fa-picture-o"></i>',
					'<img class="captcha-code-img J-captcha">',
					'<input type="text"  class="form-control" name="captcha_code" placeholder="请输入图片验证码!"',
					'check-type="required"',
					'data-focus="true">',
					'</div>',
					'<p class="ptb10 J-sendMsg fs12" style="display: none">短信已发送到<span class="t-warning">'+$$vue.showPhone+'</span> </p>',
					'<div class="form-group J-validItem validItem">',
					'<label ><i class="t-danger fa-asterisk mr5 fs10"></i>手机验证码</label>',
					'<i class="fa-comment-o" ></i>',
					'<a class="btn btn-warning btn-send-code J-getMobileCode"><span class="text-gradient">发送验证码</span></a>',
					'<input type="text" class="form-control" name="sms_code" placeholder="请输入手机验证码!" check-type="required" data-focus="true">',
					'</div>'
				].join("");
				var $dialog = $.dialog(str, {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							var sms_code =  $dialog.find("input[name='sms_code']").val();
							PAGE.ajax({
								url: url,
								type: type,
								data: {device_id: $$vue.list[index].id,phone:$$vue.authPhone,code:sms_code, token: token},
								success: function () {
									$$vue.list.splice(index, 1);
									$.dialog.close($dialog);
									$.tips("删除成功！")
								}
							});
						return false;
						}
					}, {
						text: "取消", click: function () {

						}
					}]

				});
				var $captcha = $dialog.find(".J-captcha");


				$captcha.click(changeImage);

				changeImage();

				//发送短信验证码
				$dialog.find(".J-getMobileCode").click(function () {
					$dialog.find(".J-sendMsg").hide();
					var $this =$(this);
					if($this.data("lock") || $this.data("lock-text")){
						return ;
					}
					var captcha_code =  $dialog.find("input[name='captcha_code']").val();

					if(!captcha_code){
						$dialog.find("input[name='captcha_code']").parents(".J-validItem").removeClass("validSuccess").addClass("validError").find(".J-valid-msg").html("请填写正确的图形验证码")
						return ;
					}
					$this.data("lock",true).data("lock-text",true);
					var $text =$this.find(".text-gradient");

					if(!$text.data("origin-text")){
						$text.data("origin-text",$text.html());
					}
					var originText = $text.data("origin-text");
					$text.data("text",60).html(60);

					PAGE.ajax({type:"post",
						data:{sms_type:"check",phone:$$vue.authPhone,captcha_code:captcha_code},
						url:"/smart_lock/v1/member/sms",
						success:function () {
							$dialog.find(".J-sendMsg").show();
							timoutCount($text,60,function(){
								$text.data("text",originText).html(originText);
								$this.data("lock-text",false);
							});
						},complete:function () {
							$this.data("lock",false);
						},errorCallBack:function () {
							$this.data("lock-text",false);
							$text.data("text",originText).html(originText);
						}});
				});

			},
			add: function () {

			},

			cancelAdd: function (index) {

			},
			modify: function (index) {
				var $$vue = this;
				$$vue.list[index].edit = "modify";
				$$vue.list[index].new_device_name = $$vue.list[index].device_name;
				$$vue.list[index].new_device_mode = $$vue.list[index].device_mode;
				$$vue.list[index].new_group_name = $$vue.list[index].group_name;

				this.$forceUpdate()
			},
			cancelModify: function (index) {
				this.list[index].edit = "";
				this.list[index].new_group_name = ""
				this.$forceUpdate()
			},
			getPhone:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/user/get_mobile";
				var type = "post";

				PAGE.ajax({
					asnyc:false,
					url: url,
					type: type,
					data: { token: token},
					success: function (ret) {
						$$vue.authPhone = ret.mobile;// 加密的手机号
						$$vue.showPhone = ret.phone;//带掩码的手机号，用于展示
					}
				});
			},
			getNextPage2:function () {
				if(!this.total_page2){
					return;
				}
				if(this.params2.page_number<this.total_page2){
					this.params2.page_number++;
					this.refreshList2();
				}

			},
			// ### 4.11 查询分组列表
			// |  POST  |  smart_lock/v1/device_group/find_list  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// | group_name| String | 否 |  分组名称  |  |
			// | page_size | Interger | 是 | 每页数量 | |
			// |page_number | Interger |是 | 页数 ||
			refreshList2:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/device_group/find_list";
				var type = "post";
				$$vue.loading2 = true;
				PAGE.ajax({url:url,type:type,data:$$vue.params2,success:function (ret) {
					if( !ret ){
						return;
					}
					if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
						$$vue.list = [{
							"id": 0,
							"group_name": "无分组"
						}];
						return;
					}
					listMap[$$vue.params2.page_number] = ret.list;
					$$vue.total_page2 = ret.total_page;
					$$vue.list2 = $$vue.mergeArray(listMap)
					$$vue.list2.unshift({
						"id": 0,
						"group_name": "无分组"
					});
				},complete:function () {
					$$vue.loading2 = false;
				}});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				this.getPhone();
				this.refreshList2();
				$module = $("#" + moduleId)
			})
		}
	});

	$module.parents(".tab-content-item").on("updateContent",function () {
		$$vue.refreshList();
	});
	$module.on("update",function () {
		$$vue.refreshList();
	})

	$module.on("click",".J-filter",function () {
		$$vue.filter();
	});
	$module.find(".J-scroll").on("scrollDown",function () {
		if(!$$vue.loading2){
			$$vue.getNextPage2();
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