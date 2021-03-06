
$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	function bindClick() {

		$(".J-bind-wechat").click(function () {
			// ### 用户绑定openid
			// |  post  |  smart_lock/v1/user/bind_weixin  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// | token | string | 是 | 用户登录的token |
			// |  uri | string | 是 | 授权成功后，跳转地址链接，需要进行urlencode |  |
			window.location.href="https://smart-api.kitcloud.cn/smart_lock/v1/user/bind_weixin?&token="+token+"&uri="+encodeURIComponent(window.location.href)

		})
	}

	PAGE.ajax({
		url:"/smart_lock/v1/user/bind_status",
		data:{
			uri:encodeURIComponent(window.location.href),
			token:token
		},
		type:"post",
		success:function (ret) {
			if(ret.status==1){
				$(".J-bind-wechat").html("已绑定微密码登录").addClass("disable").show()
			}else{
				$(".J-bind-wechat").html("绑定微密码登录").show();
				bindClick();
			}

		}
	});

});