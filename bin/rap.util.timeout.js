var slice = Array.prototype.slice;

//register rendering time from call point
rap.log_full_time = function (name) {

	var debug = require("./rap.server.debug");

	rap._start_time_log = new Date();

	debug.log("Timing start [" + name + "]");

	window.setTimeout(function () {

		var time = new Date();

		rap.log("Timing end [" + name + "]:" + (time.valueOf() - rap._start_time_log.valueOf()) / 1000 + "s");

	}, 1);

};


/**
 *
 *节流，减少触发次数
 *
 * */
rap.debounce = function (callback, time) {


	time = time || 10000;

	callback.params = callback.params || [];

	//锁定10s
	if (!callback.lock) {

		setTimeout(function () {

			callback(callback.params);

			callback.lock = false;

			callback.params = null;

		}, time);

		callback.lock = true;

	}

	callback.params.push(slice.call(arguments, 2));

};


/**
 *
 *按周期来
 *
 * */
rap.interval = function (callback, time) {

	setTimeout(function () {

		callback();

		rap.interval(callback, time);

	}, time);

};


/**
 *
 * 获取下一个的值
 *
 * */
function getNextValue(arr, curVal) {

	var nextValue;

	arr.sort(function (a, b) {

		return (a - b > 0) ? -1 : 1;

	});

	arr.forEach(function (val) {

		if (curVal < val) {

			nextValue = val;

		}

	});

	return nextValue;
}


/**
 *
 * 按照时钟去timeout
 *
 * */
rap.intervalByHour = function (callback, hours, name) {

	var curHour = new Date().getHours();

	var nextHour = getNextValue(hours, curHour);

	var nextDate = new Date();

	if (typeof nextHour == "undefined") {

		nextDate = new Date(+new Date() + 24 * 60 * 60 * 1000);

		nextDate.setHours(hours[0]);

	} else {

		nextDate.setHours(nextHour);

	}

	nextDate.setSeconds(0);

	nextDate.setMinutes(0);

	var timeoutTime = nextDate.getTime() - new Date().getTime();

	console.log(nextDate,nextDate.toLocaleString(),timeoutTime)
	console.log(new Date().toLocaleString())

	rap.info("[intervalByHour]", name || "", "下一次启动将在", Math.round(timeoutTime / 1000 / 60 / 6) / 10, "小时后");

	setTimeout(function () {

		callback();

		rap.intervalByHour(callback, hours);

	}, timeoutTime)

};


/**
 *
 * 按照星期点去timeout
 *
 * */
rap.intervalByWeek = function (callback, weeks, name) {

	var curweek = new Date().getDay();

	var nextweek = getNextValue(weeks, curweek);

	//超过了
	var d;

	if (typeof nextweek == "undefined") {

		d = weeks[0] - curweek + 7;

	} else {

		d = nextweek - curweek;

	}

	rap.info("[intervalByWeek]", name || "", "下一次启动将在", d, "天后");

	var nextDate = new Date(+new Date() + 24 * 60 * 60 * 1000 * d);

	nextDate.setHours(0);

	nextDate.setSeconds(0);

	nextDate.setMinutes(0);

	var timeoutTime = nextDate - new Date();

	setTimeout(function () {

		callback();

		rap.intervalByWeek(callback, weeks);

	}, timeoutTime)


};
