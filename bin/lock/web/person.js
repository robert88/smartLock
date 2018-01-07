
$(function () {

	var token = PAGE.getToken();
		if(!token){
			return;
		}
	var $moudle = $("#systemPerson")
	var VsystemPerson = new Vue({
		el: "#systemPerson-table",
		data: {
			list: []
		},
		filters: {
			role:function (value) {
				switch (value){
					case 10:
						return "超级管理员"
						break;
					case 11:
						return "普通管理员"
						break;
					default:
						return "普通人员"
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
		},
		methods:{
			seachPerson:function (event) {
				seachPerson($(event.target).parents(".search-wrap").find("input").val());
			}
		}
	});

	function refrashPerson(page_number,user_name) {
		var params = {page_number: page_number || 1, page_size: 10,token:token}
		if (user_name) {
			params.user_name = user_name;
		}

		PAGE.ajax({url:"/smart_lock/v1/user/find_list",data:params,type:"post",success:function (ret) {
			var data = ret&&ret.list;
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


	$moudle.find(".J-filter").click(function () {
		$moudle.find(".search-filter-wrap").toggleClass("open")
	}
	);

	$moudle.find(".J-search input").keyup(function (e) {
		if(e.key=="enter"){
			seachPerson($(this).val());
		}
	}).on("click",".J-delete",function () {
		$.dialog("是否要删除该记录？",{
			title:"提示",
			button:[{text:"确认",click:function () {
				var $btn = $(this);
				PAGE.ajax({url:"smart_lock/v1/user/delete",data:{user_id:$btn.data(id)},type:"post",success:function (ret) {
					refrashPerson();
				}});
			}},{text:"取消",click:function () {

			}}]

		})
	})
});