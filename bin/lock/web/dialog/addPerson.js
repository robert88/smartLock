
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var $form = $("#addPerson")
	var $dialog = $form.parents(".dl-dialog");

	//表单注册
	$form.validForm({
		success:function ($btn) {
			PAGE.ajax({
				data:$form.serialize()+"&token="+token,
				type:'post',
				url:"/smart_lock/v1/user/add",
				success:function (ret) {
					$.dialog.closeAll();
					$.tips("添加成功！","success");
					$("#systemPerson").trigger("update");
				}
			})
		}
	});

	//添加角色
	new Vue({
		el:"#roleList",
		data:{
			list:[],
			params:{page_number:1,page_size:20,role_name:"",token:token}
		},
		methods:{
			getRole:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/role/find_list";
				var type = "post";
				PAGE.ajax({url:url,type:type,data:$$vue.params,success:function (ret) {
					if( !ret ){
						return;
					}
					if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
						$.tips("请先添加角色","warn",function () {
							window.location.hash="#/web/roleList.html";
						});
					}
					$$vue.list[$$vue.params.page_number] = ret.list;
				}});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.getRole();
			})
		}
	});

	//窗口关闭时调用
	$dialog[0].destory = function () {
		if($$vue){
			$$vue.$destroy();
			$$vue = null;
		}
	}
});