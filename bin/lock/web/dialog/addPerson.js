
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var $form = $("#addPerson");
	//表单注册
	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize()+"&token="+token,
				type:'post',
				url:"/smart_lock/v1/user/add",
				success:function (ret) {
					$.dialog.closeAll();
				}
			})
		}
	});
	var roleListVue = new Vue({
		el:"#roleList",
		data:{
			role_name:"",
			page_number:1,
			list:[]
		}
	})
	//角色列表
	function getRole(){

		var params = {page_number: roleListVue.page_number || 1, page_size: 20,token:token};
		if (roleListVue.role_name) {
			params.role_name = roleListVue.role_name;
		}

		
		PAGE.ajax({url:"/smart_lock/v1/role/find_list",data:params,type:"post",success:function (ret) {
			
			if( !ret ){
				return;
			}
			if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
				$.tips("请先添加角色","warn",function () {
					window.location.hash="#/web/roleList.html";
				});
			}
			roleListVue.list = roleListVue.list.concat(ret.list);
			roleListVue.page_number = ret.page_number;
			roleListVue.total_page = ret.total_page
		}});
	}
	getRole();
});