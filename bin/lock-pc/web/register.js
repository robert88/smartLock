;(function () {

	var $form = $("#registerForm");

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
	//表单注册
	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize(),
				type:'post',
				url:"/smart_lock/v1/member/register",
				success:function (ret) {
					PAGE.setToken(ret);
					$.tips("注册成功","success");
					
				}
			})
		}
	});

	//发送短信验证码
	$form.find(".J-getMobileCode").click(function () {
		var $this =$(this);
		if($this.data("lock") || $this.data("lock-text")){
			return ;
		}
		var mobile = $form.find("input[name='phone']").val();
		var captcha_code =  $form.find("input[name='captcha_code']").val();
		if(!/^\d{11,}$/.test($.trim(mobile))){
			$form.find("input[name='phone']").focus().parents(".J-validItem").removeClass("validSuccess").addClass("validError").find(".J-valid-msg").html("请填写正确的手机号");
			return ;
		}
		if(!captcha_code){
			$form.find("input[name='captcha_code']").parents(".J-validItem").removeClass("validSuccess").addClass("validError").find(".J-valid-msg").html("请填写正确的图形验证码")
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
			data:{sms_type:"register",phone:mobile,captcha_code:captcha_code},
			url:"/smart_lock/v1/member/sms",
			success:function () {
				$.tips("发送成功","success");
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

})();