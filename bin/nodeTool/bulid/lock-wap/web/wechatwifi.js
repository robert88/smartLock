$(function () {

	
	// var token = PAGE.getToken();
	// if (!token) {
	// 	return;
	// }

	function wifiIntrock() {
		var url =  "/smart_lock/v1/jssdk/wifi";
		var type = "get";
		PAGE.ajax({
			url: url,
			type: type,
			data: {url: encodeURIComponent(window.location.href)},
			success: function (ret) {
				if(ret.length){
					ret =ret[0]
				}

				if(ret&&window.wx){
					$.tips("连接微信wifi接口！"+ret.signature,"success");
					wx.config({
						beta:true,
						debug:true,
						appId: ret.appId, // 必填，公众号的唯一标识
						timestamp:ret.timestamp , // 必填，生成签名的时间戳
						nonceStr: ret.nonceStr, // 必填，生成签名的随机串
						signature: ret.signature,// 必填，签名，见附录1
						jsApiList: ["configWXDeviceWiFi"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function(){

						$.tips("wx ready！","success",600000);
						try{
							wx.invoke("configWXDeviceWiFi",function (ret) {
								if(typeof ret=="object"){
									$.tips("configWXDeviceWiFi！"+JSON.stringify(ret),"success");
								}else{
									$.tips("configWXDeviceWiFi！"+ret,"success");
								}
							});
						}catch (e){
							$.tips(e.toString(),"error");
						}

					});

				}
			}
		});
	}

	wifiIntrock();

	PAGE.destroy.push(function () {
		if($$vue){
			$("body").off("scrollDown."+moduleId);
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module=null
		}
	})
});
