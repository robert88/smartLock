
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var moduleId = "setDeviceAlarmTel";
	var moduleVueId = moduleId+"Vue";
	var $module = $("#"+moduleId);
	var $relativeModule = $("#deviceModule");//关联的模块

	var $dialog = $module.parents(".dl-dialog");
	var listMap = [];

	var $triggerBtn = $dialog.data("trigger");
	var device_id;
	if ($triggerBtn && $triggerBtn.length) {
		device_id = $triggerBtn.data("device_id");
	}


	//表单注册
	$module.validForm({
		success:function ($btn) {
			// ### 4.20 设置设备告警电话
			// |  POST  |  smart_lock/v1/device/set_warning_num  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  device_id | Interger | 是 |  设备id  |  |
			// | mobile_num | String | 是 | 手机号码 | 1234567897,25252622642 |
			var mobile =$module.serialize().replace("&mobile_num=",",").replace("mobile_num=",",").replace(/,+/g,",").replace(/(^,)|(,$)/g,"")
			PAGE.ajax({
				data:{device_id:device_id,mobile_num:mobile,token:token},
				type:'post',
				url:"/smart_lock/v1/device/set_warning_num",
				success:function (ret) {
					$.dialog.closeAll();
					$.tips("添加成功！","success");
					$relativeModule.trigger("update");
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
		$module.trigger("setBlur");
	});

});