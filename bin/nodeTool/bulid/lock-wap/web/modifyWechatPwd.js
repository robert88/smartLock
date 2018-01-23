
$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}

	var curAccordEmail = $.cookie("user_email");

	var $form = $("#modifyWechatPwd");


	var $captcha = $form.find(".J-captcha");
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

	//校验用户是否存在
	//回车提交
	$form.find(".J-submitBtn").addClass("J-submitFocus");
// ### 2.5 修改用户密码
// 	|  POST  |  smart_lock/v1/user/modify_pwd  |
// 	| ------------- |:-------------:|
//
// 	**请求参数：**
//
// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
// 	|  -------- | -------- | -------- | -------- | ---- |
// 	|  token | string | 是 | 用户登录的token |  |
// 	|  captcha_code | String | 是 |  图形验证码 | 字符串 |
// 	|  pwd_type | String | 是 | 密码类型，login为登录密码，wechat为微密码| |
// 	|  old_pwd | String | 是 |  旧密码  |  |
// 	|  new_pwd | String | 是 | 新密码 | |
// 	|  re_pwd | String | 是 | 重复密码 | |
	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize()+"&pwd_type=wechat"+"&token="+token,
				type:'post',
				url:"/smart_lock/v1/user/modify_pwd",
				success:function (ret) {
					$.tips("密码更改成功!","success",function () {
						$.cookie("token","");
						window.location.hash="#/web/login.html";
					});

				},errorCallBack:function () {
					changeImage();
				}
			})
		}
	});



});