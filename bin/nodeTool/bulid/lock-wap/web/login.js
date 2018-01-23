;(function () {

	var $form = $("#loginForm");

	var $captcha = $form.find(".J-captcha");
	
	//回车提交
	$form.find(".J-submitBtn").addClass("J-submitFocus");

	$captcha.click(changeImage);
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

	changeImage();

// 	### 2.8 用户登录
// 	|  POST  |  smart_lock/v1/member/login  |
// 	| ------------- |:-------------:|
//
// 	**请求参数：**
//
// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
// 	|  -------- | -------- | -------- | -------- | ---- |
// 	|  email | String | 是 |  用户邮箱  | 字符串 |
// 	|  password | String | 是 |  用户密码 | 字符串 |
// 	| captcha_code | String | 是 | 图形验证码 | 字符串 |
//
// 	**返回**
// 	```
// {
//   "msg": "", //错误原因
//   "code": 200 //业务码,d
//   "data": {
//   		"token": '用户生成的安全串'
//   }
// }
	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize(),
				type:'post',
				url:"/smart_lock/v1/member/login",
				success:function (ret) {
					$.tips("登录成功","success");
					PAGE.setToken(ret);
				},errorCallBack:function () {
					changeImage();
				}
			})
		}
	});

})();