$(function () {

	var VsystemPerson = new Vue({
		el: "#systemPerson",
		data: {
			list: []
		},
		filters: {
			role:function (value) {
				switch (value){
					case 1:
						return "设计师"
						break;
					case 2:
						return "程序员"
						break;
					default:
						return "系统管理员"
						break;
				}
			},
			type:function (value) {
				switch (value){
					case 1:
						return "开门"
						break;
					case 2:
						return "关门"
						break;
					default:
						return "更新密码"
						break;
				}
			},
		}
	});

	function refrashPerson(page_number,user_name) {
		var ret={}
				var params={page_number:page_number||1,page_size:10};
			if(user_name){
				params.user_name = user_name;
			}

		// PAGE.ajax({url:"smart_lock/v1/user/find_list",data:params,type:"post",success:function (ret) {
		var data = ret&&ret.data;
		data=  {
			"page_number": 1,
			"page_size": 2,
			"total_page": 12,
			"total_row": 100,
			"list": [{
				"id":123,
				"user_email":"xxxx@xxx.com",
				"user_name":"test",
				"update_pwd_time" : "2016-11-11 11:11:11", //最后一次密码更新时间
				"user_phone": "13401111111",
				"consumer_id":23456,
				"role_id": 1, //角色ID
				"type": 10,
				"update_time": "2016-11-11 11:11:11",
				"create_time": "2016-11-11 11:11:11"
			}]
		}
		if( !data ){
			return;
		}

		VsystemPerson.list = data;

		PAGE.setpageFooter($("#systemPerson").find(".pagination"),data.total_page,data.page_number,function (page_number) {
			refrashPerson(page_number);
		});
		// }});
	}

	refrashPerson();

});