;(function () {

	var $form = $("#loginForm");

	$form.find(".J-submitBtn").addClass("J-submitFocus");

	var $captcha = $form.find(".J-captcha");
	$captcha.click(changeImage);
	function changeImage(){
		$captcha[0].src = "http://smart-api.kitcloud.cn/smart_lock/v1/member/captcha?type=register&ver="+ (new Date().getTime());
	}

	changeImage();

	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize(),
				type:'post',
				url:"/smart_lock/v1/member/login",
				success:function (ret) {
					$.tips("登录成功","success");
				}
			})
		}
	});

})();