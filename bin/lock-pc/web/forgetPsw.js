;(function () {

	var $form = $("#forgetPsw");
	var $resetForm = $("#forgetReset");
	var $forget_model = $("#forget_model");


		
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

	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize(),
				type:'post',
				url:"/smart_lock/v1/member/forget_password",
				success:function (ret) {
					$resetForm.find("input[name='token']").val(ret.token);
					$form.hide();
					$resetForm.show();
					$forget_model.find(".title").html("设置新密码");
					//回车提交
					$resetForm.find(".J-submitBtn").addClass("J-submitFocus");

				},errorCallBack:function () {
					changeImage();
				}
			})
		}
	});

	//重置密码
	$resetForm.find(".back").click(function () {
		$form.show();
		$resetForm.hide();
		$forget_model.find(".title").html("找回密码");
		//回车提交
		$form.find(".J-submitBtn").addClass("J-submitFocus");
	})
	$resetForm.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$resetForm.serialize(),
				type:'post',
				url:"/smart_lock/v1/member/reset_password",
				success:function (ret) {
					window.location.href = "/#/web/login.html?nomenu=1"

				},errorCallBack:function () {
					changeImage();
				}
			})
		}
	});

})();