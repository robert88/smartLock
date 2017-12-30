rap.module = {};

function Count(){
	this.resursion_level = 0;
}
Count.prototype.out = function () {
	rap.resursion_level--;
};
Count.prototype.in = function () {
	this.resursion_level++;
	if (this.resursion_level >= 10){
		return true;
	}
};
/*
 * 注册模块
 * */
rap.registerModule = function () {
	var arg = arguments;
	var registerName = arg[0].moduleName;
	if (rap.debug_module)rap.log("注册模块：" + registerName);
	var t = function (data) {
		if (!t)return rap.module[registerName].prototype
		var origins = t._register_wait;
		if (origins) {
			for (var i = 1; i < origins.length; i++) {
				if (origins[i]._register_wait)origins[i] = origins[i].call(rap, data);
			}
		}
		rap.module[registerName] = rap.initModule.apply(rap, origins);
		t = origins = null;
		if (this != rap)return new rap.module[registerName](data);
		else return rap.module[registerName];
	};
	t._register_wait = Array.prototype.slice.call(arg, 0);
	return (rap.module[registerName] = t);
};
/*
 * 初始化模块
 * */
rap.initModule = function () {
	var arg = arguments;
	var selfModule = {};
	if (rap.debug_module)console.log("初始化模块 ", arg[0].moduleName);
	var initGroup = [];
	var i = arg.length;
	while (i--) {
		if (arg[i].prototype) {
			arg[i] = arg[i].prototype
		}
		if (arg[i].$init) {
			initGroup.push(arg[i].$init)
		}
		rap.extend(true, selfModule, arg[i])
	}
	selfModule.$init = function () {
		for (var i = 0; i < initGroup.length; i++)
			initGroup[i].apply(this, arguments);
	};
	var result = function (config) {
		this.$ready = [];
		this.$init(config);
		if (this.filter)this.filter(config);
		for (var i = 0; i < this.$ready.length; i++)
			this.$ready[i].call(this);
	};
	result.prototype = selfModule;
	selfModule = arg = null;
	return result;
};
/*
 * 添加一个数组类型判断
 * */
var isArray = function (obj) {
	return Object.prototype.toString.call(obj)=="[object Array]";
};

/*
 /*
 * 重新解析
 * */
var resursion_in_map=[];
rap.stringify = function (obj,filter,space,count) {



	if(resursion_in_map.indexOf(obj)==-1){
		resursion_in_map.push(obj);
	}else if(obj!=null){
		return "[same Object]";

	}

	// console.log("-----------",obj)

	if(typeof obj=="object" && obj != null && !obj.nodeName){

		if(count==null){
			count = new Count();
		}
		if(count.in()){
			count.out();
			return "[deep Object]"
		}

		var str = [];

		var isArrayFlag = isArray(obj);


		for(var key in obj){

			if( filter == "function" ){

				str.push( filter(key,obj[key]) || "");

			}else {

				if( isArray(filter) ){

					if(filter.indexOf(key)==-1){

						continue;

					}

				}

				var keyStr = isArrayFlag?"":( "\"" + key + "\":" );

				if(typeof obj[key]=="object"){

					str.push( keyStr + rap.stringify( obj[ key ],null,null,count ) );

				}else if(typeof  obj[key] == "function" ){

					str.push( keyStr+"\"{0}\"".tpl(Object.prototype.toString.call(obj[ key] ))  );

				}else if(typeof  obj[key] == "string" ){

					str.push( keyStr + "\"{0}\"".tpl( obj[ key ] )  );

				}else{

					str.push( keyStr + "{0}".tpl( obj[ key ] )  );

				}
			}

		}
		space = (space==null)?",":space;

		count.out();

		if(count.resursion_level==0){
			count=null;
		}

		return isArrayFlag?("["+str.join(space)+"]"):("{" + str.join(space) + "}");

	}else{

		return  obj+"";

	}

}
