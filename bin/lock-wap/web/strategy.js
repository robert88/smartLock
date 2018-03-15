

$(function () {

	var token = PAGE.getToken();
	if (!token) {
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "strategyModule";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			curTime:new Date("2018/02/04").getTime(),
			loading:false,
			params:{page_number:1,page_size:10,strategy_name:"",token:token}
		},
		watch: {
			//对象不应该用handler方式，应该值改变了但是引用没有改变
			"params.page_number":function (newValue, oldValue) {
				if(newValue!=oldValue){
					this.refreshList();

				}
			},
			"params.strategy_name":function (newValue, oldValue) {
					
				if(newValue!=oldValue){
				listMap = [];
					if(this.params.page_number!=1){
						this.params.page_number =1;
					}else{
						this.refreshList();
					}
				}
			}
		},
		methods: {
			formatDate:function (url) {
				if(url==24*60*60*1000){
					return "24:00"
				}
				return (url+this.curTime).toString().toDate().format("hh:mm");
			},
			formatAllowTime:function (val,name) {
				var ret = [];
				var allow_timeArr = val.split(",")||[];
              for(var i=0;i<allow_timeArr.length;i++){
              	if(allow_timeArr[i]){
                    var allow_time = allow_timeArr[i].split("_")||[];
                    if(allow_time.length==2){
                        var start = this.formatDate( ($.trim(allow_time[0])||0)*60*1000 );
                        var end = this.formatDate( ($.trim(allow_time[1])||0)*60*1000 );
                        ret.push("<span class='t-info bd bd-info plr5 itemValue fs12 bd-radius-5 mr5'>"+ start +"~"+end+"</span>");
                    }
				}
			  }
			  return "<span class='mr5 w30'>"+name+":</span><span class='inline-block w100'style='word-wrap: break-word;'>"+ret.join("")+"</span> ";
			},
			mergeArray: function (obj) {
				if (typeof obj !== "object") {
					return [];
				}
				;
				var arr = [];
				for (var no in obj) {
					if ($.type(obj[no]) != "array") {
						continue;
					}
					arr = arr.concat(obj[no]);
				}
				return arr;
			},
			getNextPage: function () {
				if (!this.total_page) {
					return;
				}
				if (this.params.page_number < this.total_page) {
					this.params.page_number++;
					this.refreshList();
				}

			},
			filter: function () {
				$module.find(".search-filter-wrap").toggleClass("open");
			},
			isSelf:function (email) {
				if(email&&(email==curAccordEmail)){
					return false;
				}
				return true;
			},

			refreshList:function () {
				// ### 7.5 查询策略列表
				// |  POST  |  smart_lock/v1/strategy/find_list |
				// | ------------- |:-------------:|
				//
				// **请求参数：**
				//
				// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
				// |  -------- | -------- | -------- | -------- | ---- |
				// |  strategy_name | String | 否 | 策略名称  |  |
				// | page_size | Interger | 是 | 每页数量 | |
				// |page_number | Interger |是 | 页数 ||
				var $$vue = this;
				var url = "/smart_lock/v1/strategy/find_list";
				var type = "post";
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: this.params,
					type: type,
					success: function (ret) {
						if (!ret ) {
							return;
						}

						$$vue.list = ret.list||[];

                        listMap[$$vue.params.page_number] = ret.list;
                        $$vue.total_page = ret.total_page;
                        $$vue.list = $$vue.mergeArray(listMap);

					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},

			saveAdd:function (index) {

			},
			// ### 6.2 更新角色
			// |  POST  |  /smart_lock/v1/strategy_mode/modify  |
			// | ------------- |:-------------:|

			saveModify:function (index) {

				var $$vue = this;
				var url =  "/smart_lock/v1/strategy_mode/modify";
				var type = "post";

				if(!$$vue.list[index].new_strategy_name){
					$.tips("请输入角色名","warn");
					return;
				}
				PAGE.ajax({
					url: url,
					type: type,
					data: {strategy_id: this.list[index].id,strategy_name: this.list[index].new_strategy_name, token: token},
					success: function (ret) {
						$$vue.list[index].strategy_name = $$vue.list[index].new_strategy_name;
						$$vue.list[index].edit="";
						$$vue.$forceUpdate();
						$.tips("修改成功！","success");
					}
				});
			},
			del: function (index) {

				var $$vue = this;
				//新增的数据直接删除
				if (!$$vue.list[index].id) {
					$$vue.list.splice(index, 1);
					return;
				}
				var url = "/smart_lock/v1/strategy/delete";
				var type = "post";
				$.dialog("是否要删除该记录？", {
					title: "删除记录",
					width: 400,
					button: [{
						text: "确认", click: function () {
							PAGE.ajax({
								url: url,
								type: type,
								data: {strategy_id: $$vue.list[index].id, token: token},
								success: function () {
									$.tips("操作成功！", "success");
									$$vue.list.splice(index, 1);
								}
							});

						}
					}, {
						text: "取消", click: function () {

						}
					}]

				})
			},
			add:function () {

			},
			cancelAdd: function (index) {
				this.del(index);
			},
			modify:function (index) {
				this.list[index].edit = "modify";
				this.list[index].new_strategy_name = this.list[index].strategy_name;
				this.$forceUpdate()
			},
			cancelModify:function (index) {
				this.list[index].edit = "";
				this.$forceUpdate()
			},
			allow_openmodeText:function (value) {
				value = value.split(",");
				var item;
				var map = {"11":"远程控制","12":"密码"}
				var ret=[]
				for(var i=0;i<value.length;i++){
					item = $.trim(value[i]);
					if(item){
						ret.push(map[item]);
					}
				}
				return ret.join(",")
			},
			allow_operationText:function (value) {
				value = value.split(",");
				var item;
				var map = {"11":"开门","12":"关门"}
				var ret=[]
				for(var i=0;i<value.length;i++){
					item = $.trim(value[i]);
					if(item){
						ret.push(map[item]);
					}
				}
				return ret.join(",")
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#"+moduleId);
				this.initEvent($module);
			})
		}
	});

	$("body").on("scrollDown." + moduleId, function () {
		if (!$$vue.loading) {
			$$vue.getNextPage();
		}
	});

	PAGE.destroy.push(function () {
		if($$vue){
			$("body").off("scrollDown." + moduleId);
			$$vue.$destroy();
			$$vue = null;
			$module=null
		}
	})
});