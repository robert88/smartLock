
//全局方法
Vue.prototype.isSelf =function (email) {
	var curAccordEmail = $.cookie("user_email");
	if(email&&(email==curAccordEmail)){
		return false;
	}
	return true;
};
//查询
Vue.prototype.filter =function ($module) {
	$module.find(".search-filter-wrap").toggleClass("open");
};
//设置权限
Vue.prototype.hasPermission =function (access_id) {
	if(!access_id){
		return true;
	}
	var access_ids = access_id.toString().split(",");
	var access_list = $.cookie("access_list");
	for(var i=0;i<access_ids.length;i++){
		access_id = $.trim(access_ids[i]);
		if(new RegExp("\\b"+access_id+"\\b").test(access_list)){
			return true;
		}
	}
	return false;
};
//参数改变
Vue.prototype.paramsChange =function (type,needChangeNumber) {

	if(this[type].params.page_number!=1 && needChangeNumber){
		this[type].params.page_number =1;
	}else{
		this.refreshList(type);
	}
};
//下一页
Vue.prototype.getNextPage =function (type) {
	if (!this[type].totalPage) {
		return;
	}
	if (this[type].params.page_number < this[type].totalPage) {
		this[type].params.page_number++;
		this.refreshList(type);
	}
};
//合并数组
Vue.prototype.mergeArray = function (obj) {
	if (typeof obj !== "object") {
		return [];
	}

	var arr = [];
	for (var no in obj) {
		if ($.type(obj[no]) != "array") {
			continue;
		}
		arr = arr.concat(obj[no]);
	}
	return arr;
};

/**
 *设置表单数据
 * */
Vue.prototype.setInputValue=function (name, value,$module) {
	if (value != null && $module.find("input[name='" + name + "']").length) {
		$module.find("input[name='" + name + "']").val(value).addClass("ipt-not-empty");
	}
};
/**
 *设置下拉菜单数据
 * */
Vue.prototype.setSelectValueByName=function (name, value,$module) {
	var $input = $module.find("input[name='" + name + "']")
	if (value != null && $input.length) {
		if($input.parents(".J-mutil-select").length){
			$.each(value.split(","),function (index,val) {
				if(val){
					$input.parents(".J-select").find(".option[data-name='" + val + "']").click();
				}
			})
		}else{
			$input.parents(".J-select").find(".option[data-name='" + value + "']").click();
		}

	}
};
/**
 *设置下拉菜单数据
 * */
Vue.prototype.setSelectValue=function (name, value,$module) {
	var $input = $module.find("input[name='" + name + "']")
	if (value != null && $input.length) {
		if($input.parents(".J-mutil-select").length){
			$.each(value.split(","),function (index,val) {
				if(val){
					$input.parents(".J-select").find(".option[data-value='" + val + "']").click();
				}
			})
		}else{
			$input.parents(".J-select").find(".option[data-value='" + value + "']").click();
		}

	}
};
/**
 *初始化事件
 * */
Vue.prototype.initEvent=function (type,$module) {
	var $$vue = this;
	$module.on("listupdate",function () {
		$$vue.refreshList(type);
	})
	$module.on("click",".J-filter",function () {
		$$vue.filter($module);
	});
	$module.parents(".tab-content-item").on("updateContent",function () {
		$$vue.refreshList(type);
	});
}