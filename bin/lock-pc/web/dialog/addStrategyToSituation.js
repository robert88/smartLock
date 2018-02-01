

$(function () {

	var token = PAGE.getToken();
	if(!token){
		return;
	}
	var curAccordEmail = $.cookie("user_email");
	var moduleId = "addStrategyToSituation";
	var moduleVueId = moduleId;
	var $module = $("#"+moduleId);
	var listMap = [];
	var $dialog = $module.parents(".dl-dialog");
	var $relativeModule = $("#situationModule");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var situational_id;
	if ($triggerBtn && $triggerBtn.length) {
		situational_id = $triggerBtn.data("situational_id");
	}

	var $$vue = new Vue({
		el: "#"+moduleVueId,
		data: {
			list: [],
			params:{page_number:1,page_size:10,situational_id:situational_id,token:token}
		},
		methods:{
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
			isSelf: function (email) {
				if (email && (email == curAccordEmail)) {
					return false;
				}
				return true;
			},
			refreshList:function () {
				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/find_unbind_strategy";
				var type = "post";
				if ($$vue.loading) {
					return;
				}
				$$vue.loading = true;
				PAGE.ajax({
					url: url,
					data: $$vue.params,
					type: type,
					success: function (ret) {
						if (!ret) {
							return;
						}
						$$vue.list = ret.list;

						PAGE.setpageFooter($module.find(".pagination"), ret.total_page, ret.page_number, function (page_number) {
							$$vue.params.page_number = page_number
						});
						$$vue.$nextTick(function () {
							$dialog.trigger("setcenter");
						})
					},
					complete: function () {
						$$vue.loading = false;
					}
				});
			},
			addStrategy:function (index) {
				var $$vue = this;
				var url = "/smart_lock/v1/situational_mode/add_strategy";
				var type = "post";
				PAGE.ajax({

					url: url, data: {strategy_id:$$vue.list[index].id,situational_id:situational_id}, type: type, success: function (ret) {
						$.tips("操作成功！","success");
						$$vue.list.splice(index,1);
						$.dialog.closeAll()
					}
				});
			},
			initEvent:function () {

			}

		},
		mounted: function () {
			this.$nextTick(function () {
				this.refreshList();
				$module = $("#" + moduleId);
			})
		}
	});

	$module.on("scrollDown." + moduleId, ".J-scroll",function () {
		if (!$$vue.loading) {
			$$vue.getNextPage();
		}
	});

	$dialog[0].destroy  = function () {
		if($$vue){
			$relativeModule.trigger("update");
			$("body").off("scrollDown." + moduleId);
			$$vue.$destroy();
			listMap = null;
			$$vue = null;
			$module=null;
		}

	}

});