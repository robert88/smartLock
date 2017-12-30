/**
 * Created by 84135 on 2017/9/30.
 */
var http = require("http");
var loginCount = 0;
var captchacount =0
var registerCount = 0;
exports = module.exports = {
	"/api/captcha":function (request, response,next) {
		captchacount++
		var ret
		if(captchacount>1){captchacount=0

			ret = "/public/images/yanzhema1.png"
		}else{
			ret = "/public/images/yanzhema2.png"
		}
		next(ret)
	},
	"/api/game/skill":function (request,response,next) {
		var str = "/api/game/skill";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":[{"id":1,"title":"\u4e09\u7ea7\u5316\u80a5","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/e7673b33e0a2fa91532f13c71fba4e4c.png","introduce":"\u65bd\u4e09\u7ea7\u5316\u80a5\uff0c\u6210\u719f\u65f6\uff0c\u6700\u9ad8\u53ef\u653650\u5143\u5b9d\uff0c25\u679a\u91d1\u5e01\uff0c\u6bcf\u4e2a\u9636\u6bb5\u4ec5\u9650\u65bd\u80a5\u4e00\u6b21\u3002","type":0},{"id":2,"title":"\u4e8c\u7ea7\u5316\u80a5","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/a0533eb1f5632aa6417602626c22a6dc.png","introduce":"\u65bd\u4e8c\u7ea7\u5316\u80a5\uff0c\u6210\u719f\u65f6\uff0c\u6700\u9ad8\u53ef\u6536100\u5143\u5b9d\uff0c50\u679a\u91d1\u5e01\uff0c\u6bcf\u4e2a\u9636\u6bb5\u4ec5\u9650\u65bd\u80a5\u4e00\u6b21\u3002","type":0},{"id":3,"title":"\u4e00\u7ea7\u5316\u80a5","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/1d93cc7013645b200cf1e4ffc3af73eb.png","introduce":"\u65bd\u4e00\u7ea7\u5316\u80a5\uff0c\u6210\u719f\u65f6\uff0c\u6700\u9ad8\u53ef\u6536300\u5143\u5b9d\uff0c150\u679a\u91d1\u5e01\uff0c\u6bcf\u4e2a\u9636\u6bb5\u4ec5\u9650\u65bd\u80a5\u4e00\u6b21\u3002","type":0},{"id":5,"title":"\u751f\u547d\u6db2","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/0227e57f60bcf83bebf011ec8dfa3dba.png","introduce":"\u6447\u94b1\u6811\u88ab\u6536\u53d6\u4e09\u6b21\u540e\uff0c\u987b\u4e3a\u5b83\u6d47\u4e00\u58f6\u751f\u547d\u6db2\uff0c\u624d\u80fd\u7ee7\u7eed\u751f\u4ea7\u6536\u76ca\uff01\u5426\u5219\u5c06\u4e0d\u80fd\u65bd\u80a5\u3002","type":1},{"id":6,"title":"\u5c60\u9f99\u5200","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/6a70fa98a8f56af5588412941eef7aa8.png","introduce":"\u88ab\u9f99\u5f62\u5c01\u5370\u6240\u7f69\u4f4f\u7684\u6447\u94b1\u6811\u987b\u4f7f\u7528\u5c60\u9f99\u5200\u5c06\u5176\u5c01\u5370\u7834\u9664\uff0c\u624d\u80fd\u8ba9\u5176\u4ea7\u751f\u6536\u76ca\u3002","type":1},{"id":7,"title":"\u53eb\u82b1\u9e21","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/f61e6a096a9d45202118a74793701e68.png","introduce":"\u6bcf\u53ea\u9e21\u53ef\u4fdd\u6301\u7075\u517d5\u5c0f\u65f6\u7684\u4f53\u529b\u53ca\u589e\u52a01\u4e2a\u70b9\u7684\u6210\u957f\u503c\u3002","type":2}]}
		next( {code:count,data:data.data});
	},
	"/api/user/guide":function (request,response,next) {
		var str = "/api/user/guide";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},

	"/api/pay":function (request,response,next) {
		var str = "/api/pay";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},
	"/api/game":function (request,response,next) {
		var str = "/api/game";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"hot":[{"id":1,"title":"\u4e09\u7ea7\u5316\u80a5","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/e7673b33e0a2fa91532f13c71fba4e4c.png","price":50,"unit":"\u5143\u5b9d","introduce":"\u65bd\u4e09\u7ea7\u5316\u80a5\uff0c\u6210\u719f\u65f6\uff0c\u6700\u9ad8\u53ef\u653650\u5143\u5b9d\uff0c25\u679a\u91d1\u5e01\uff0c\u6bcf\u4e2a\u9636\u6bb5\u4ec5\u9650\u65bd\u80a5\u4e00\u6b21\u3002","type":0,"buy":1},{"id":2,"title":"\u4e8c\u7ea7\u5316\u80a5","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/a0533eb1f5632aa6417602626c22a6dc.png","price":100,"unit":"\u5143\u5b9d","introduce":"\u65bd\u4e8c\u7ea7\u5316\u80a5\uff0c\u6210\u719f\u65f6\uff0c\u6700\u9ad8\u53ef\u6536100\u5143\u5b9d\uff0c50\u679a\u91d1\u5e01\uff0c\u6bcf\u4e2a\u9636\u6bb5\u4ec5\u9650\u65bd\u80a5\u4e00\u6b21\u3002","type":0,"buy":1},{"id":3,"title":"\u4e00\u7ea7\u5316\u80a5","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/1d93cc7013645b200cf1e4ffc3af73eb.png","price":300,"unit":"\u5143\u5b9d","introduce":"\u65bd\u4e00\u7ea7\u5316\u80a5\uff0c\u6210\u719f\u65f6\uff0c\u6700\u9ad8\u53ef\u6536300\u5143\u5b9d\uff0c150\u679a\u91d1\u5e01\uff0c\u6bcf\u4e2a\u9636\u6bb5\u4ec5\u9650\u65bd\u80a5\u4e00\u6b21\u3002","type":0,"buy":1}],"property":[{"id":5,"title":"\u751f\u547d\u6db2","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/0227e57f60bcf83bebf011ec8dfa3dba.png","price":50,"unit":"\u5143\u5b9d","introduce":"\u6447\u94b1\u6811\u88ab\u6536\u53d6\u4e09\u6b21\u540e\uff0c\u987b\u4e3a\u5b83\u6d47\u4e00\u58f6\u751f\u547d\u6db2\uff0c\u624d\u80fd\u7ee7\u7eed\u751f\u4ea7\u6536\u76ca\uff01\u5426\u5219\u5c06\u4e0d\u80fd\u65bd\u80a5\u3002","type":1,"buy":1},{"id":6,"title":"\u5c60\u9f99\u5200","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/6a70fa98a8f56af5588412941eef7aa8.png","price":50,"unit":"\u5143\u5b9d","introduce":"\u88ab\u9f99\u5f62\u5c01\u5370\u6240\u7f69\u4f4f\u7684\u6447\u94b1\u6811\u987b\u4f7f\u7528\u5c60\u9f99\u5200\u5c06\u5176\u5c01\u5370\u7834\u9664\uff0c\u624d\u80fd\u8ba9\u5176\u4ea7\u751f\u6536\u76ca\u3002","type":1,"buy":1}],"food":[{"id":7,"title":"\u53eb\u82b1\u9e21","icon":"http:\/\/admin.shnmkj.net.cn\/uploads\/config\/2017\/11\/f61e6a096a9d45202118a74793701e68.png","price":50,"unit":"\u5143\u5b9d","introduce":"\u6bcf\u53ea\u9e21\u53ef\u4fdd\u6301\u7075\u517d5\u5c0f\u65f6\u7684\u4f53\u529b\u53ca\u589e\u52a01\u4e2a\u70b9\u7684\u6210\u957f\u503c\u3002","type":2,"buy":1}]}}
		next( {code:count,data:data.data});
	},
	"/api/homeland":function (request,response,next) {
		var str = "/api/homeland";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		data = {
			"user_id": 6,
			"name": "大鹏0578776", // 用户昵称
			"mobile": "15201103715",
			"sex": 1,
			"referrer": "大鹏", // 推荐人昵称
			"gold": "1,400.00", //元宝数量
			"coin": "6.00",  // 金币数量
			"is_realname": 1, // 是否已实名认证，0否，1是
			"is_bank": 1 // 是否已绑定银行卡，0否，1是
		}

		next( {code:count,data:data});
	},

"/api/homeland/view":function (request,response,next) {
	var str = "/api/homeland/view";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	count = exports[str].count =1;
	var data
	if(request.params.type=="1"){
		 data = {
			 "account": "李大鹏",
			 "bank": "上海银行",
			 "card": "3434343444"
		 }
	}else {
		data = {
			"truename": "李大鹏",
			"cardid": "130533199108104819",
			"font": "imageurl",
			"back": "imageur"
		}
	}

	next( {code:count,data:data});
},
		"/api/homeland/coins":function (request,response,next) {
	var str = "/api/homeland/coins";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	count = exports[str].count =1;
	var data = {
		"code": 1,
		"msg": "获取成功",
		"data": {
			"number": 1400,
			"deposit": 1400,
			"status": 0, //0代表已绑定银行卡，1代表未实名认证，需跳转到实名认证；2代表未绑定银行卡
			"account": "李大鹏",
			"bank": "上海银行",
			"card": "3434343444",
			"log": [
				{
					"id": 2,
					"type": 0, // 类型，0购买元宝，1购买道具，2收获摇钱树,3元宝提现
					"number": 23,
					time:"2014"

				},
				{
					"id": 1,
					"type": 2,
					"number": 10,time:"2014"

				}
			]
		}
	}
	next( {code:count,data:data.data});
},
	"/api/homeland/gold":function (request,response,next) {
		var str = "/api/homeland/gold";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		data = {
			"code": 1,
			"msg": "获取成功",
			"data": {
				"number": 1400,
				"deposit": 1400,
				"status": 0, //0代表已绑定银行卡，1代表未实名认证，需跳转到实名认证；2代表未绑定银行卡
				"account": "李大鹏",
				"bank": "上海银行",
				"card": "3434343444",
				"log": [
					{
						"id": 2,
						"type": 0, // 类型，0购买元宝，1购买道具，2收获摇钱树,3元宝提现
						"number": 23,
						time:"2014"

					},
					{
						"id": 1,
						"type": 2,
						"number": 10,time:"2014"

					}
				]
			}
		}
		next( {code:count,data:data.data});
	},
	"/api/jssdk":function (request,response,next) {
		var str = "/api/jssdk";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;

		var data ={"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":[{"appId":"wxf54428e4fc1c4c08","nonceStr":"yMWixTVYouZFRa8B","timestamp":1510066328,"url":"test","signature":"1dae074a425d1e8736b86ab151a4267dd668d5db","rawString":"jsapi_ticket=kgt8ON7yVITDhtdwci0qeTK8G7bP53jKOLfrWJ2uVoabZiW37n3a3UMhp3s_NwVnox5GzYfBm3IBBqHwz2PLGg\u0026noncestr=yMWixTVYouZFRa8B\u0026timestamp=1510066328\u0026url=test"}]}

		next( {code:count,data:data.data});
	},
	"/api/user/forget":function (request,response,next) {
		var str = "/api/user/forget";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		data = {
			"token": "S0M1OWgwaFNmc3dHRWN3ejVmYWFiQT09"
		}
		next( {code:count,data:data});
	},
	"/api/user/reset":function (request,response,next) {
		var str = "/api/user/reset";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},

	"/api/homeland/bank":function (request,response,next) {
		var str = "/api/homeland/bank";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{path:"/load/1.png"}});
	},
	"/api/homeland/upload":function (request,response,next) {
		var str = "/api/homeland/upload";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{path:"/load/1.png"}});
	},

	"/api/game/pocket":function (request,response,next) {
		var str = "/api/game/pocket";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = [
			[
				{
					"id": 1,
					"title": "三级化肥",
					"icon": "/public/images/propsItem/010daoju1.png",
					"introduce": "施三级化肥，成熟时，最高可收50元宝，25枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 2,
					"title": "二级化肥",
					"icon": "/public/images/propsItem/011daoju2.png",
					"introduce": "施二级化肥，成熟时，最高可收100元宝，50枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 3,
					"title": "一级化肥",
					"icon": "/public/images/propsItem/012daoju3.png",
					"introduce": "施一级化肥，成熟时，最高可收300元宝，150枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 4,
					"title": "特级化肥",
					"icon": "/public/images/propsItem/013daoju4.png",
					"introduce": "施特级化肥，成熟时，最高可收500元宝，250枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 5,
					"title": "生命液",
					"icon": "/public/images/propsItem/014daoju5.png",
					"introduce": "摇钱树被收取三次后，须为它浇一壶生命液，才能继续生产收益哟！否则，将无法称作。",
					"number":10,
					"type": 1
				},
				{
					"id": 6,
					"title": "屠龙刀",
					"icon": "/public/images/propsItem/015daoju6.png",
					"introduce": "被龙形封印所罩住的摇钱树须使用屠龙刀将其封印破除，才能让其产生收益。",
					"number":12,
					"type": 1
				}
			],
			[
				{
					"id": 7,
					"title": "叫花鸡",
					"icon": "/public/images/propsItem/016daoju7.png",
					"introduce": "每只鸡可保持灵兽5小时的体力及增加1个点的成长值。",
					"number":12,
					"type": 2
				}
			]
		]
		next( {code:count,data:data});
	},

	"/api/homeland/withdraw":function (request,response,next) {
		var str = "/api/homeland/withdraw";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{
			"serial": "2",
			"status": "1",
			"apply_type": "1",// 特殊化肥1
			"apply_at": "2017-10-15 18:13:45",
			"countdown": 7*24*60*60
		}});
	},
	"/api/user/treasure":function (request,response,next) {
		var str = "/api/user/treasure";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{gold:1000,coin:1000}});
	},
	"/api/log/show":function (request,response,next) {
		var str = "/api/log/show";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{
			"title": "测试",
			"content": "<p>sdfsdf</p>",
			"author": "22",
			"status": 3,
			"hanger": 0
		}});
	},
	"/api/user/animal":function (request,response,next) {
		var str = "/api/user/animal";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{
			"nickname": "测试",
			"level": 2,
			"grown": "22",
			"status": 3,
			"hanger": 0
		}});
	},
	"/api/trees/steal":function (request,response,next) {
		var str = "/api/trees/steal";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{"number": 9
		}});
	},

"/api/reward":function (request,response,next) {
	var str = "/api/reward";
	exports[str].count =  (exports[str].count==null?-1:exports[str].count);
	var count = ++exports[str].count;
	if(count>5){
		count = exports[str].count =1;
	}
	next( {code:count});
},
	//破除
"/api/trees/relieve":function(request,response,next){
	var str = "/api/trees/relieve";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}

	next( {code:count,data:{coin:10,gold:10,"serial":request.params.serial,"status":"1","apply_type":"1","apply_at":"2017-11-02 13:22:37","earings_at":"2017-11-09 13:22:37","countdown":10}});
},
	//树
	"/api/trees":function(request,response,next){
		var str = "/api/trees";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = {
			"code": 1,
			"msg": "\u83b7\u53d6\u6210\u529f",
			"data": [{
				"serial": "0",
				"nickname": "robert.yin\u7684\u795e\u517d",
				"level": 1,
				"grown": "0",
				"status": 0,
				"hanger": 0
			}, {
				"serial": "1",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}, {
				"serial": "2",
				"status": "2",
				"apply_type": "1",
				"apply_at": "2017-11-02 13:22:37",
				"earings_at": "2017-11-09 13:22:37",
				"countdown": 10
			}, {
				"serial": "3",
				"status": "2",
				"daily": 1,
				"residue": 10, //代表距下次收获63150s
				"apply_type": "1",
				"apply_at": "2017-11-02 13:22:37",
				"earings_at": "2017-11-09 13:22:37",
				"countdown": 63151
			}, {
				"serial": "4",
				"status": "2",
				"daily": 0,
				"residue": 0, //代表距下次收获63150s
				"apply_type": "1",
				"apply_at": "2017-11-02 13:22:37",
				"earings_at": "2017-11-09 13:22:37",
				"countdown": 63151
			}, {
				"serial": "5",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}, {
				"serial": "6",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}, {
				"serial": "7",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}, {
				"serial": "8",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}, {
				"serial": "9",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}, {
				"serial": "10",
				"status": "0",
				"apply_type": "0",
				"apply_at": "2017-10-26 12:20:50",
				"earings_at": "2017-10-26 12:20:50",
				"countdown": -1
			}]
		}
		
		next( {code:count,data:data.data});
	},
	"/api/trees/daily":function (request,response,next) {
		var str = "/api/trees/daily";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;

		next( {code:count,data:{coin:10,gold:10,"daily": 1,"residue": 10,"serial":request.params.serial,"status":"2","apply_type":"1","apply_at":"2017-11-02 13:22:37","earings_at":"2017-11-09 13:22:37","countdown":10}});
	},
	//生命药水
	"/api/trees/life":function (request,response,next) {
		var str = "/api/trees/life";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{coin:10,gold:10,"serial":request.params.serial,"status":"1","apply_type":"1","apply_at":"2017-11-02 13:22:37","earings_at":"2017-11-09 13:22:37","countdown":10}});
	},
	//施肥
	"/api/trees/apply":function (request,response,next) {
		var str = "/api/trees/apply";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{coin:10,gold:10,"serial":request.params.serial,"status":"2","apply_type":"1","apply_at":"2017-11-02 13:22:37","earings_at":"2017-11-09 13:22:37","countdown":10}});
	},
	//收获
	"/api/trees/collect":function (request,response,next) {
		var str = "/api/trees/collect";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{coin:10,gold:10,"serial":request.params.serial,"status":"3","apply_type":"1","apply_at":"2017-11-02 13:22:37","earings_at":"2017-11-09 13:22:37","countdown":10}});
	},
"/api/log/share":function (request,response,next) {
	var str = "/api/log/share";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"id":50,"note":"\u597d\u53cb\u6d88\u8d39\u5956\u52b1,\u83b7\u5f971\u4e2a\u91d1\u5e01"},{"id":49,"note":"\u597d\u53cb\u6d88\u8d39\u5956\u52b1,\u83b7\u5f971\u4e2a\u91d1\u5e01"},{"id":14,"note":"\u597d\u53cb\u6d88\u8d39\u5956\u52b1,\u83b7\u5f971\u4e2a\u91d1\u5e01"},{"id":5,"note":"\u597d\u53cb\u6d88\u8d39\u5956\u52b1,\u83b7\u5f972\u4e2a\u91d1\u5e01"}],"pages":1}}
	next( {code:count,data:data.data})
},
"/api/log/operate":function (request,response,next) {
	var str = "/api/log/operate";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"id":183,"note":"\u5077\u53d6\u91d1\u5e01\u6210\u529f\uff0c\u83b7\u5f97\u91d1\u5e01\u6570\u91cf\u4e3a1"},{"id":51,"note":"\u65bd\u80a5\u6210\u529f(\u7f16\u53f7:2)"},{"id":6,"note":"\u6447\u94b1\u6811\u7834\u9664\u5c01\u5370\uff08\u7f16\u53f7:2\uff09"}],"pages":1}}
	next( {code:count,data:data.data})
},
"/api/log/pay":function (request,response,next) {
	var str = "/api/log/pay";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"id":73,"body":"\u8d26\u6237\u5145\u503c","orderNo":"1509558235429099997"},{"id":43,"body":"\u8d26\u6237\u5145\u503c","orderNo":"1509470013006599997"},{"id":42,"body":"\u8d26\u6237\u5145\u503c","orderNo":"1509469817240499997"},{"id":38,"body":"\u8d26\u6237\u5145\u503c","orderNo":"1509468635395899997"}],"pages":1}}
	next( {code:count,data:data.data})
},
"/api/log":function (request,response,next) {
	var str = "/api/log";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"id":13,"title":"\u81f4\uff01\u4eb2\u7231\u7684\u4f60\u4e00\u5c01\u4fe1\uff08\u4e0a\uff09"},{"id":12,"title":"\u81f4\uff01\u4eb2\u7231\u7684\u4f60\u4e00\u5c01\u4fe1\uff08\u4e0b\uff09"},{"id":11,"title":"\u5ba2\u670dQQ\uff1a2174179897"},{"id":9,"title":"\u5185\u6d4b\u798f\u5229\uff01\u9080\u8bf7\u597d\u53cb\u8d5a\u6536\u76ca"}],"pages":1}}
	next( {code:count,data:data.data})
},
"/api/game/fighter":function (request,response,next) {
	var str = "/api/game/fighter";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	var data ={"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"uid":"6","name":"Jaa","treasure":"3045","steal":"5","rank":1},{"uid":"7","name":"\u5929\u738b\u76d6\u5730\u864e","treasure":"1526","steal":"3","rank":2},{"uid":"3","name":"robert.yin","treasure":"1024","steal":"2","rank":3},{"uid":"2","name":"\u5927\u9e4f\u5c55\u7fc5","treasure":"1000","steal":"1","rank":4},{"uid":"4","name":"\u5c3c\u5927\u7237","treasure":"1000","steal":"4","rank":5},{"uid":"5","name":"\u54af\u58a8\u8ff9","treasure":"500","steal":"7","rank":6},{"uid":"9","name":"\u4ed6\u5f3a\u4efb\u4ed6\u5f3a","treasure":"300","steal":null,"rank":7},{"uid":"1","name":"\u5927\u9e4f","treasure":"128","steal":null,"rank":8},{"uid":"1037","name":"\u5f88\u9177","treasure":"1","steal":null,"rank":9}],"ranking":3}}
	next( {code:count,data:data.data})
},
	"/api/game/animal":function (request,response,next) {
	var str = "/api/game/animal";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
		var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"username":"\u4ed6\u5f3a\u4efb\u4ed6\u5f3a","nickname":"\u4ed6\u5f3a\u4efb\u4ed6\u5f3a\u7684\u795e\u517d","grown":"0","rank":1},{"username":"\u5927\u9e4f0578","nickname":"\u5927\u9e4f0578\u7684\u795e\u517d","grown":"0","rank":2},{"username":"\u5927\u9e4f\u5c55\u7fc5","nickname":"\u5927\u9e4f\u5c55\u7fc5\u7684\u795e\u517d","grown":"0","rank":3},{"username":"robert.yin","nickname":"robert.yin\u7684\u795e\u517d","grown":"0","rank":4},{"username":"\u5c3c\u5927\u7237","nickname":"\u5c3c\u5927\u7237\u7684\u795e\u517d","grown":"0","rank":5},{"username":"Jaa","nickname":"Jaa\u7684\u795e\u517d","grown":"0","rank":6},{"username":"\u5929\u738b\u76d6\u5730\u864e","nickname":"\u5929\u738b\u76d6\u5730\u864e\u7684\u795e\u517d","grown":"0","rank":7},{"username":"\u9694\u58c1\u8001\u738b","nickname":"\u9694\u58c1\u8001\u738b\u7684\u795e\u517d","grown":"0","rank":8},{"username":"\u5014\u5f3a\u7684\u5c0f\u732b","nickname":"\u5014\u5f3a\u7684\u5c0f\u732b\u7684\u795e\u517d","grown":"0","rank":9}],"ranking":4}}
	next( {code:count,data:data.data});
	},
"/api/game/friend":function (request,response,next) {
	var str = "/api/game/friend";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	var data = {"code":1,"msg":"\u83b7\u53d6\u6210\u529f","data":{"list":[{"uid":"6","name":"Jaa","treasure":"3045","steal":"5"},{"uid":"7","name":"\u5929\u738b\u76d6\u5730\u864e","treasure":"1526","steal":"3"},{"uid":"3","name":"robert.yin","treasure":"1024","steal":"2"},{"uid":"2","name":"\u5927\u9e4f\u5c55\u7fc5","treasure":"1000","steal":"1"},{"uid":"4","name":"\u5c3c\u5927\u7237","treasure":"1000","steal":"4"},{"uid":"5","name":"\u54af\u58a8\u8ff9","treasure":"500","steal":"7"},{"uid":"9","name":"\u4ed6\u5f3a\u4efb\u4ed6\u5f3a","treasure":"300","steal":null},{"uid":"1","name":"\u5927\u9e4f","treasure":"128","steal":null},{"uid":"1037","name":"\u5f88\u9177","treasure":"1","steal":null}],"pages":0}}
	next( {code:count,data:data.data})
},
	"api/game/fanimal":function (request,response,next) {
		var str = "api/game/fanimal";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>2){
			count = exports[str].count =1;
		}
		var data={}
		next( {code:count,data:data.data})
	},
"/api/user/logout":function (request,response,next) {
	var str = "/api/user/logout";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	next( {code:count})
},
	"/api/pay/gold":function (request,response,next) {
		var str = "/api/pay/gold";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>2){
			count = exports[str].count =1;
		}
		next( {code:count,data:{"url": "www.baidu.com"}});
	},
	"/api/user/login":function(request,response,next){
		var ret = {code:1,msg:"success"};
		if(loginCount>6){
			loginCount=0
		}

		switch (++loginCount){
			case 1:
				ret = {code:1};
				request.cookie.push("login_token=RUVIQ2JFZ3ZIM2RwcURUbkhsOWE4QWdsWmdEV2ZZZlhSZWNxY2ZsTmlScz0;path=/");
				request.cookie.push("login_uid=123;path=/");
				request.cookie.push("forest_sex=0;path=/");
				request.cookie.push("forest_gold=100;path=/");
				request.cookie.push("forest_coin=500;path=/");
				request.cookie.push("invite_code=5648;path=/");
				request.cookie.push("login_nickname=yinming;path=/");
				if(request.params.remember_account){
					request.cookie.push("login_username=18688714537;path=/");
				}else{
					request.cookie.push("login_username='';path=/");
				}
				if(request.params.remember_password){
					request.cookie.push("login_password=RUVIQ2JFZ3ZIM2RwcURUbkhs;path=/");
				}else{
					request.cookie.push("login_password='';path=/");
				}
				// response.setHeader("Set-Cookie","name=login_uid;;","12345678")
				break;
			case 2:
				ret = {code:2};
				break;
			case 3:
				ret = {code:3};
				break;
			case 4:
				ret = {code:4};
				break;
			case 5:
				ret = {code:5};
				break;
			case 6:
				ret = {code:6};
				break;
			case 7:
				ret = {code:7};
				break;
		}
		next(ret)
	},
	"/api/user/sms":function(request,response,next){
		var str = "/api/user/sms";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count});
	},
	"/api/user/register":function(request,response,next){
		var ret = {code:1,msg:"success"};
		if(registerCount>=10){
			registerCount=0
		}

		switch (++registerCount){
			case 1:
				ret = {code:1};
				request.cookie.push("login_token=RUVIQ2JFZ3ZIM2RwcURUbkhsOWE4QWdsWmdEV2ZZZlhSZWNxY2ZsTmlScz0;path=/");
				request.cookie.push("login_uid=123;path=/");
				if(request.params.remember_account){
					request.cookie.push("login_username=18688714537;path=/");
				}else{
					request.cookie.push("login_username='';path=/");
				}
				if(request.params.remember_password){
					request.cookie.push("login_password=RUVIQ2JFZ3ZIM2RwcURUbkhs;path=/");
				}else{
					request.cookie.push("login_password='';path=/");
				}
				// response.setHeader("Set-Cookie","name=login_uid;;","12345678")
				break;
			default:
				ret = {code:registerCount};
				break;
		}
		next(ret)
	}
};