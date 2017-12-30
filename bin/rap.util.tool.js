
/*对外接口*/
rap.isArray = function (obj) {
	return rap.type(obj) === "array";
};
rap.toArray = function (obj) {
	return rap.isArray(obj)?obj:[obj];
};
rap.isFunction = function (func) {
	return rap.type(func) == "function";
};
rap.type = function (obj) {
	var class2type = {
		"[object Array]":"array",
		"[object Null]":"null",
		"[object Function]":"function"
	}
	var toString = class2type.toString;
	if (obj == null) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
	class2type[toString.call(obj)] || "object" :
		typeof obj;
};

rap.isWindow = function (obj) {
	/* jshint eqeqeq: false */
	return obj != null && obj == obj.window;
};
rap.isEmptyObject = function (obj) {
	var name;
	for (name in obj) {
		return false;
	}
	return true;
};

rap.isPlainObject = function (obj) {

	var class2type = {};

	// var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};

	var key;

	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || rap.type(obj) !== "object" || obj.nodeType || rap.isWindow(obj)) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
			return false;
		}
	} catch (e) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	if (support.ownLast) {
		for (key in obj) {
			return hasOwn.call(obj, key);
		}
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for (key in obj) {
	}

	return key === undefined || hasOwn.call(obj, key);
};


rap.extend = function () {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;

		// skip the boolean and the target
		target = arguments[i] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !rap.isFunction(target)) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if (i === length) {
		target = this;
		i--;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && ( rap.isPlainObject(copy) || (copyIsArray = rap.isArray(copy)) )) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && rap.isArray(src) ? src : [];

					} else {
						clone = src && rap.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = rap.extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
/*
 * 判断非空对象
 * */
rap.isUnEmptyObject = function(obj) {
	return obj != null && typeof obj == "object"
};
/*
 * 类型代理函数
 * */
rap.proxyHander = function(proxy, objectCallback, nullCallback) {
	if (typeof proxy == "function") {
		return proxy.call(this);
	} else if (rap.isUnEmptyObject(proxy)) {
		return objectCallback.call(this, proxy)
	} else if (typeof proxy == "string") {
		return proxy;
	} else if (typeof nullCallback == "function") {
		return nullCallback.call(this);
	}
	return "";
};

/*
 * 字符串变成树形结构
 * */
function strToTree(str, obj, innerRegExp, prevSpread, nextSpread) {
	innerRegExp.lastIndex = 0;
	obj = obj || {};
	if (!innerRegExp.test(str)) {
		obj.children = [];
		obj.originStr = str;
		return obj;
	}
	var startIndex, endIndex;
	if (typeof prevSpread == "function") {
		startIndex = prevSpread(startIndex, str)
	}
	var ret = [];
	var topStr = str.replace(innerRegExp, function (m, index) {
		ret.push({text: m, start: index});
		return "";
	})
	obj.children = ret;
	obj.originStr = str;
	innerRegExp.lastIndex = 0;
	return strToTree(topStr, {subTree: obj}, innerRegExp, prevSpread, nextSpread)
}

/*
 * 树形结构变成字符串
 * */
function treeToStr(tree, originStr) {
	if (tree.subTree) {
		for (var i = 0; i < tree.children.length; i++) {
			var item = tree.subTree.children[i];
			originStr = originStr.slice(0, item.start) + item.text + originStr.slice(item.start, originStr.length)
		}
	}
	return treeToStr(tree.subTree, originStr)
	return originStr;
}