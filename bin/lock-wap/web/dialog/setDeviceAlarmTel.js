
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var moudleId = "setDeviceAlarmTel";
	var moudleVueId = moudleId+"Vue";
	var $moudle = $("#"+moudleId);
	var $relativeMoudle = $("#deviceMoudle");//关联的模块

	var $dialog = $moudle.parents(".dl-dialog");
	var listMap = [];

	//表单注册
	$moudle.validForm({
		success:function ($btn) {
			// ### 4.20 设置设备告警电话
			// |  POST  |  smart_lock/v1/device/set_warnning_num  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  device_id | Interger | 是 |  设备id  |  |
			// | mobile_num | String | 是 | 手机号码 | 1234567897,25252622642 |
			var mobile =$moudle.serialize().replace("&mobile_num=",",").replace("mobile_num=",",").replace(/,+/g,",").replace(/(^,)|(,$)/g,"")
			PAGE.ajax({
				data:"mobile_num="+mobile+"&token="+token,
				type:'post',
				url:"/smart_lock/v1/device/set_warnning_num",
				success:function (ret) {
					$.dialog.closeAll();
					$.tips("添加成功！","success");
					$relativeMoudle.trigger("update");
				}
			})
		}
	});

	$dialog.find(".J-add").click(function () {
		var str = ['<div class="form-group J-validItem validItem">',
		'<i class="fa fa-font"></i>',
		'<input type="text" class="form-control" placeholder="请输入告警电话！"  name="mobile_num" check-type="required mobile" data-focus="true">',
		'</div>'].join("");
		$dialog.find(".J-add-content").append(str);
		$moudle.trigger("setBlur");
	});

});