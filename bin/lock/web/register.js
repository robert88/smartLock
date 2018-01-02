;(function () {
	require("./public/js/common.js");
	var $form = $("#registerForm");
	var $captcha = $form.find(".J-captcha");
	$captcha.click(changeImage);
	function changeImage(){
		$captcha[0].src = "http://smart-api.kitcloud.cn/smart_lock/v1/member/captcha?type=register&ver="+ (new Date().getTime());
	}

	changeImage();

	$form.find(".J-submitBtn").addClass("J-submitFocus");
	var validForm = PAGE.validForm({
		validSuccess:function ($form) {

			PAGE.ajax({
				data:$form.serialize(),
				type:'post',
				url:"/smart_lock/v1/member/register",
				success:function (ret) {
					$.tips("注册成功","success");
				}
			})
		},
		validError:function($target,msg){
			$target.focus();
		},
		form:$form
	});

	$form.find(".J-getMobileCode").click(function () {
		var $this =$(this);
		if($this.data("lock") || $this.data("lock-text")){
			return ;
		}
		var mobile = $form.find("input[name='mobile']").val();
		if(!/^\d{5,}$/.test($.trim(mobile))){
			$.tips("请填写正确的手机号","error");
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
			msg:{
				"1" :"发送成功",
				"2": "手机号格式不正确",
				"3" :"用户不存在（即手机号未注册，用于找回密码）",
				"4": "用户已注册",
				"5": "发送失败"
			},
			data:{type:"register",mobile:mobile},
			url:"/api/user/sms",
			success:function () {
				timoutCount($text,60,function(){
					$.tips("发送成功","success")
					$text.data("text",originText).html(originText);
					$this.data("lock-text",false);
				});
			},complete:function () {
				$this.data("lock",false);
			},errorCallBack:function () {
				$this.data("lock-text",false);
				$text.data("text",originText).html(originText);
			}});
	})
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
	/*自定义校验方法*/
	var validRule = validForm("getRule");
	validRule["password"] = {
		check:function(value, $obj) {

			//传递了比较值
			var validLenth = /^(\d|[a-z]){6,12}$/i.test(value);
			var validNum = /[0-9]/.test(value);
			var validLetter = /[a-zA-Z]/.test(value);
			return ! (validNum&&validLetter && validLenth) ;
		},
		defaultMsg:"请填写6-12位同时包含字符和数字的密码"

	}
})();