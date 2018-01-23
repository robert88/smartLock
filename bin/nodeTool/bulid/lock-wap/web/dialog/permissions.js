require("/public/js/ztree/jquery.ztree.core.js")
require("/public/js/ztree/jquery.ztree.excheck.js");
$(function () {
	var token = PAGE.getToken();
	if (!token) {
		return;
	}

	var $tree = $("#addPermisionsTree");
	var $dialog = $tree.parents(".dl-dialog");

	//触发的按钮把数据带过来
	var $triggerBtn = $dialog.data("trigger");
	var isModify = false, isAdmin = false;
	var role_id;
	if ($triggerBtn && $triggerBtn.length) {
		if ($triggerBtn.data("status") == "modify") {
			$dialog.find(".btns").show();
			isModify = true;
		}
		if ($triggerBtn.data("admin")) {
			isAdmin = true;
		}

		role_id = $triggerBtn.data("role_id");
	}

	var setting = {
		view: {
			addHoverDom: false,
			removeHoverDom: false,
			selectedMulti: false
		},
		check: {
			enable: isModify ? true : false
		},
		data: {
			simpleData: {
				enable: true//isModify?true:false
			}
		},
		edit: {
			enable: isModify ? true : false
		},
		callback: {
			onContentReady: function () {
				//让dialog居中
				setTimeout(function () {
					$dialog.trigger("setcenter");
				}, 300);
			}
		}
	};
// ### 6.4 获取所有权限的列表
// 	|  POST  |  smart_lock/v1/role/access_list|
// 	| ------------- |:-------------:|
//
// 	**请求参数：**
//
// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
// 	|  -------- | -------- | -------- | -------- | ---- |
// 	| token | String | 是 | 用户Token |示例：06REbYPmid30pL75pfauECjxFuYGx |
	function getAllAccess(success) {
		var url = "/smart_lock/v1/role/access_list";
		var type = "post";
		PAGE.ajax({
			url: url,
			type: type,
			data: {token: token},
			success: function (ret) {
				if (typeof ret != "object") {
					return;
				}
				success(ret)
			}
		});
	}

	// ### 6.5 查询角色权限
	// |  POST  |  smart_lock/v1/role/find_access|
	// | ------------- |:-------------:|
	//
	// **请求参数：**
	//
	// |  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
	// |  -------- | -------- | -------- | -------- | ---- |
	// | token | string | 是 | 用户token | |
	// |role_id | Interger | 是 | 角色id | |
	function getAccess(opts) {
		var url = "/smart_lock/v1/role/find_access";
		var type = "post";
		PAGE.ajax({
			url: url,
			type: type,
			data: {token: token, role_id: role_id},
			success: function (ret) {
				ret = $.type(ret)=="array"?ret.join(","):"";
				opts.success(ret.replace(/\s+/g, ""));

			},
			complete:opts.complete
		});

	}

	function filterTree(treeObj, idsString) {
		var nodes = treeObj.getNodesByFilter(function (node) {
			if ((idsString&&RegExp("\\b"+node.id+"\\b").test(idsString)) ) {
				return true;
			}
			return false;
		});
		return nodes;
	}

	function setTree(treeObj,nodes) {

		for (var i = 0, l = nodes.length; i < l; i++) {
			//不需要联动
			treeObj.checkNode(nodes[i], true, false);
		}

	}

	function serialIds(treeObj) {
		var ids = [];
		var checkedNodes = treeObj.getCheckedNodes();
		for (var i = 0; i < checkedNodes.length; i++) {
			ids.push(checkedNodes[i].id);
		}
		return ids;
	}

// ### 6.4 设置权限（无新增，有则修改）
// 	|  POST  |  smart_lock/v1/role/set_access|
// 	|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
// 	|  -------- | -------- | -------- | -------- | ---- |
// 	| token | string | 是 | 用户token | |
// 	| role_id | Interger | 是 | 用户id | |
// 	| access_ids | String | 是 |  权限id,dou  |  |
	function saveAccess(treeObj) {
		var ids = serialIds(treeObj)
		var url = "/smart_lock/v1/role/set_access";
		var type = "post";
		PAGE.ajax({
			url: url,
			type: type,
			data: {token: token, role_id: role_id, access_ids: ids.join(",")},
			success: function (ret) {
				$.dialog.close($dialog);
				$.tips("设置成功","success");
			},
			complete: function () {

			}
		});
	}

	function renderTree(ret,idsString){
		var zNodes = []
		for (var i = 0; i < ret.length; i++) {
			//如果有权限或者当前是编辑模式
			if ((idsString&&RegExp("\\b"+ret[i].access_id+"\\b").test(idsString)) || isModify) {
				zNodes.push({
					id: ret[i].access_id,
					pId: ret[i].access_pid,
					name: ret[i].access_name
				});
			}
		}
		var treeObj = $.fn.zTree.init($tree, setting, zNodes);
		treeObj.expandAll(true);
		return treeObj
	}
	function initTree() {
		$tree.addClass("loading");
		getAllAccess(function (ret) {
			var idsString;
			getAccess({
					success:function (access) {
						idsString = access;
					},
					complete:function () {

						var treeObj = renderTree(ret,idsString);

						if(isModify){
							var nodes = filterTree(treeObj, idsString);
							setTree(treeObj,nodes);
							$dialog.find(".J-modify").click(function () {
								saveAccess(treeObj);
							});
						}

						$tree.removeClass("loading");
					}
				})

		});
	}

	initTree();
})
