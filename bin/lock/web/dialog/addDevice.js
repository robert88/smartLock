
$(function () {
	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var $form = $("#addDeviceForm");
	var $relativeMoudle = $("#deviceMoudle");//关联的模块

	var $dialog = $form.parents(".dl-dialog");
	var listMap = [];

	//表单注册
	$form.validForm({
		success:function ($btn) {
			// ### 4.1 添加设备（pc端）
			// |  POST  |  smart_lock/v1/device/add_by_user  |
			// | ------------- |:-------------:|
			//
			// **请求参数：**
			//
			// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
			// |  -------- | -------- | -------- | -------- | ---- |
			// |  device_code  | String   | 是 | 设备硬件唯一编码  |  |
			// |  device_name | String | 是 | 设备名称 | |
			// | device_model| String | 是 | 设备型号 | |
			PAGE.ajax({
				data:$form.serialize()+"&token="+token,
				type:'post',
				url:"/smart_lock/v1/device/add_by_user",
				success:function (ret) {
					$.dialog.closeAll();
					$.tips("添加成功！","success");
					$relativeMoudle.trigger("update");
				}
			})
		}
	});

	//添加角色
	var $$vue = new Vue({
		el:"#addPerson_roleList",
		data:{
			list:[],
			loading:false,
			total_page:0,
			params:{page_number:1,page_size:20,role_name:"",token:token}
		},
		methods:{
			mergeArray:function (obj) {
				if(typeof obj !== "object") {
					return [];
				};
				var arr = [];
				for(var no in obj) {
					if($.type(obj[no]) != "array") {
						//console.error("mergeObject", no, "is not array!");
						continue;
					}
					arr = arr.concat(obj[no]);
				}
				return arr;
			},
			stopPropagation:function (e) {
				e = e||window.event;
				if(e.stopPropagation){
					e.stopPropagation()
				}else if(e.cancelBubble){
					e.cancelBubble =false
				}
			},
			getNextPageRole:function () {
				if(!this.total_page){
					return;
				}
				if(this.params.page_number<this.total_page){
					this.params.page_number++;
					this.getRole();
				}

			},
			getRole:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/role/find_list";
				var type = "post";
				$$vue.loading = true;
				PAGE.ajax({url:url,type:type,data:$$vue.params,success:function (ret) {
					if( !ret ){
						return;
					}
					if(ret.page_number==1&& (!ret.list||ret.list.length==0)){
						$.tips("请先添加角色","warn",function () {
							window.location.hash="#/web/roleList.html";
						});
					}
					listMap[$$vue.params.page_number] = ret.list;
					$$vue.total_page = ret.total_page;
					$$vue.list = $$vue.mergeArray(listMap);
				},complete:function () {
					$$vue.loading = false;
				}});
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.getRole();
			})
		}
	});

	$dialog.find(".J-scroll").on("scrollDown",function () {
		if(!$$vue.loading){
			$$vue.getNextPageRole();
		}
	});

	//窗口关闭时调用
	$dialog[0].destory = function () {
		if($$vue){
			$$vue.$destroy();
			$form = null;
			$$vue = null;
			listMap = null;
			$dialog = null;
		}
	}
});