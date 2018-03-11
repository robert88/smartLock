
$(function () {

	var openid = $.cookie("openid");

	var $form = $("#wechatLogin");

	$form.find(".J-submitBtn").addClass("J-submitFocus");

	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize()+"&openid="+openid,
				type:'post',
				url:"/smart_lock/v1/member/openid_login",
				success:function (ret) {
					$.tips("登录成功","success");
					PAGE.setToken(ret);
				}
			})
		}
	});



});