PAGE.getToken();
$(function () {
	var $moudle = $("#personHistory")
	var VsystemPerson = new Vue({
		el: "#"+$moudle.attr("id"),
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

// ### 2.13 查询删除用户列表
// 	|  POST  |  smart_lock/v1/user/find_delete_list  |
// 	| ------------- |:-------------:|
//
// 	**请求参数：**
//
// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
// 	|  -------- | -------- | -------- | -------- | ---- |
// 	|  userId_name | string | 否 |  客户名称  |  |
// 	| page_size | Interger | 是 | 每页数量 | |
// 	| page_number | Interger |是 | 页数 ||

	function refrashPerson(page_number,user_name) {
		var params = {page_number: page_number || 1, page_size: 10}
		if (user_name) {
			params.user_name = user_name;
		}

		PAGE.ajax({url:"/smart_lock/v1/user/find_delete_list",data:params,type:"post",success:function (ret) {
			var data = ret&&ret.data;
			if( !data ){
				return;
			}

			VsystemPerson.list = data;

			PAGE.setpageFooter($moudle.find(".pagination"),data.total_page,data.page_number,function (page_number) {
				refrashPerson(page_number);
			});
		}});
	}
	function seachPerson(val) {
		if(val){
			refrashPerson(1,val);
		}
	}

	refrashPerson();

	$moudle.find(".J-search").click(function () {
		seachPerson($this.parents(".search-wrap").find("input").val());
	})

	$moudle.find(".J-search input").keyup(function (e) {
		if(e.key=="enter"){
			seachPerson($(this).val());
		}
	}).on("click",".J-delete",function () {
		$.dialog("是否要删除该记录？",{
			title:"提示",
			button:[{text:"确认",click:function () {
				var $btn = $(this);
				// ### 2.2 删除用户
				// |  POST  |  smart_lock/v1/user/delete  |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  user_id | Interger | 是 |  用户id  | 整形 |

				PAGE.ajax({url:"smart_lock/v1/user/delete",data:{user_id:$btn.data(id)},type:"post",success:function (ret) {
					refrashPerson();
				}});
			}},{text:"取消",click:function () {

			}}]

		})
	})
});