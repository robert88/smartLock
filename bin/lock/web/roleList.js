
$(function () {

	var token = PAGE.getToken();
		if(!token){
			return;
		}
	var $moudle = $("#roleList")
	var vue = new Vue({
		el: "#roleList-table",
		data: {
			list: []
		},
		watch: {
			list: {
				handler:function(newValue, oldValue) {
					for (var i = 0; i < newValue.length; i++) {
						if ((oldValue[i]&&oldValue[i].role_name) != newValue[i].name) {
							newValue[i].role_name = newValue[i].name
						}
					}
				},
				deep: true
			}
		},
		filters: {
			isAdmin:function (value) {
				switch (value){
					case 0:
						return "否"
						break;
					default:
						return "普通人员"
						break;
				}
			},
		},
		methods:{
			seachData:function (event) {
				refrashData($(event.target).parents(".search-wrap").find("input").val());
			}
		}
	});

	function refrashData(page_number,user_name) {
		var params = {page_number: page_number || 1, page_size: 10,token:token}
		if (user_name) {
			params.user_name = user_name;
		}

		PAGE.ajax({url:"/smart_lock/v1/role/find_list",data:params,type:"post",success:function (ret) {
			var data = ret&&ret.list;
			if( !data ){
				return;
			}

			vue.list = data;

			PAGE.setpageFooter($moudle.find(".pagination"),data.total_page,data.page_number,function (page_number) {
				refrashData(page_number);
			});
		}});
	}
	function seachData(val) {
		if(val){
			refrashData(1,val);
		}
	}

	refrashData();

	$moudle.on("click",".J-add",function () {
		vue.list.push({
			isTempl:"add",
			role_name:"",
			is_admin:"",
			update_time:""
		})
	}).on("click",".J-modify",function () {
		var $this =$(this);
		if($this.data("templ-index")||$this.data("templ-index")===0||$this.data("templ-index")==="0"){
			var curData = vue.list[$this.data("templ-index")];
				curData.status ="modify";
				vue.$forceUpdate()
		}
	}).on("click",".J-filter",function () {
		$moudle.find(".search-filter-wrap").toggleClass("open");
	}).on("click",".J-save",function () {
		var $this =$(this);
		if($this.data("templ-index")||$this.data("templ-index")===0||$this.data("templ-index")==="0"){
			var curData = vue.list[$this.data("templ-index")]
			PAGE.ajax({url:"/smart_lock/v1/role/add",data:{role_name:curData.role_name,is_admin:curData.is_admin?11:12,token:token},type:"post",success:function (ret) {
				curData.isTempl =false;
				curData.role_id =ret.role_id;
				curData.role_name =ret.role_name;
				curData.consumer_id =ret.consumer_id;
			}});
		}
	}).on("keyup",".J-search input",function (e) {
		if(e.key=="enter"){
			seachData($(this).val());
		}
	}).on("keyup",".J-update",function (e) {
		var $this =$(this);
		if($this.data("templ-index")||$this.data("templ-index")===0||$this.data("templ-index")==="0"){
			var curData = vue.list[$this.data("templ-index")]
			PAGE.ajax({url:"/smart_lock/v1/role/update",data:{role_name:curData.role_name,is_admin:curData.is_admin?11:12,token:token},type:"post",success:function (ret) {
				curData.isTempl =false;
				curData.role_id =ret.role_id;
				curData.role_name =ret.role_name;
				curData.consumer_id =ret.consumer_id;
			}});
		}
	}).on("click",".J-delete",function () {
		var $this =$(this);
		if($this.data("templ-index")||$this.data("templ-index")===0||$this.data("templ-index")==="0"){
			vue.list.splice($this.data("templ-index"),1);
			return;
		}
		var curData = vue.list[$this.data("templ-index")]
		$.dialog("是否要删除该记录？",{
			title:"提示",
			button:[{text:"确认",click:function () {
				var $btn = $(this);
				PAGE.ajax({url:"/smart_lock/v1/role/delete",data:{role_id:curData.role_id,token:token},type:"post",success:function (ret) {
					refrashData();
				}});
			}},{text:"取消",click:function () {

			}}]

		})
	})
});