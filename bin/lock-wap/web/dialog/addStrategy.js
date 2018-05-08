$(function () {

    var token = PAGE.getToken();
    if (!token) {
        return;
    }
    var curAccordEmail = $.cookie("user_email");
    var moduleId = "addStrategyForm";
    var moduleVueId = moduleId;
    var $module = $("#" + moduleId);
    var listMap = {};
    var $relativeModule = $("#strategyModule");//关联的模块

    var $$vue = new Vue({
        el: "#" + moduleVueId,
        data: {
            role_list: [],
            roleLoading: false,
            roleTotalPage: 0,
            role_params: {page_number: 1, page_size: 10, role_name: "", token: token},

            person_list: [],
            personLoading: false,
            personTotalPage: 0,
            person_list_params: {page_number: 1, page_size: 10, user_name: "", token: token},


            device_list: [],
            deviceLoading: false,
            deviceTotalPage: 0,
            device_list_params: {page_number: 1, page_size: 10, user_name: "", token: token},
            timeSelectList: [
                {
                    title: "开锁时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "open_time",
                    selectTime:[]
                },

                {
                    title: "全锁时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "close_time",
                    selectTime:[]
                },

                {
                    title: "关锁时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "mode_1_time",
                    selectTime:[]
                }, {
                    title: "单向时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "mode_2_time",
                    selectTime:[]
                }, {
                    title: "常开时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "mode_3_time",
                    selectTime:[]
                }, {
                    title: "点动时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "mode_4_time",
                    selectTime:[]
                },
                {
                    title: "双向时间段",
                    allow_start_time_list: [],
                    allow_end_time_list: [],
                    start_time: 0,
                    end_time: 0,
                    name: "mode_5_time",
                    selectTime:[]
                }
            ],
            allow_openmode_list: [{id: "11", name: "远程控制"}, {id: "12", name: "密码"}],
            allow_operation_list: [{id: "11", name: "开门"}, {id: "12", name: "关门"}]
        },
        watch: {
            //对象不应该用handler方式，应该值改变了但是引用没有改变
            "role_params.page_number": function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (this.role_params.page_number != 1) {
                        this.role_params.page_number = 1;
                    } else {
                        this.refreshList();
                    }
                }
            },
            "person_list_params.page_number": function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (this.person_list_params.page_number != 1) {
                        this.person_list_params.page_number = 1;
                    } else {
                        this.refreshList();
                    }
                }
            },
            timeSelectList: {
                handler: function (newValue, oldValue) {
                    for (var i = 0; i < newValue.length; i++) {
                        if (oldValue[i] != newValue[i]) {
                            this.refreshEndList(i, newValue)
                        }
                    }
                },
                deep: true
            },
        },
        methods: {
            refreshEndList: function (type, newValue) {
                var curListObj = this.timeSelectList[type]
                var newEndList = []
                var curTime = new Date("2018/02/04").getTime();
                for (var i = 0; i <= 144; i++) {
                    if ((i / 2) > newValue) {
                        if (i == 144) {
                            newEndList.push({name: "24:00", id: i / 2});
                        } else {
                            newEndList.push({
                                name: (curTime + i / 2 * 60 * 60 * 1000).toString().toDate().format("hh:mm"),
                                id: i / 2
                            });
                        }
                    }
                }
                curListObj.allow_end_time_list = newEndList;
            },
            mergeArray: function (obj) {
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
            },
            getRoleNextPage: function () {
                if (!this.roleTotalPage) {
                    return;
                }
                if (this.role_params.page_number < this.roleTotalPage) {
                    this.role_params.page_number++;
                    this.refreshRoleList();
                }
            },
            getPersonNextPage: function () {
                if (!this.personTotalPage) {
                    return;
                }
                if (this.person_list_params.page_number < this.personTotalPage) {
                    this.person_list_params.page_number++;
                    this.refreshPersonList();
                }
            },
            getDeviceNextPage: function () {
                if (!this.deviceTotalPage) {
                    return;
                }
                if (this.device_list_params.page_number < this.deviceTotalPage) {
                    this.device_list_params.page_number++;
                    this.refreshDeviceList();
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
            initAllowTime: function () {
                for(var i=0;i<this.timeSelectList.length;i++){
                    this.initAllowTimeByType(this.timeSelectList[i])
                }
            },
            initAllowTimeByType: function (curTimeList) {

                for (var i = 0; i <= 144; i++) {
                    var curMinute = i*10;
                    if (curMinute == 144*10) {
                        curTimeList.allow_start_time_list[i] = {name: "24:00", id:curMinute}
                        curTimeList.allow_end_time_list[i] = {name: "24:00", id: curMinute}
                    } else {
                        curTimeList.allow_start_time_list[i] = {
                            name: this.minuteFormat(curMinute),
                            id: curMinute
                        }
                        curTimeList.allow_end_time_list[i] = {
                            name: this.minuteFormat(curMinute),
                                id: curMinute
                        }
                    }
                }
            },
            minuteFormat:function (minute) {
                var curTime = new Date("2018/02/04").getTime();
                return (curTime + minute * 60 * 1000).toString().toDate().format("hh:mm")
            },
            refreshRoleList: function () {
                var $$vue = this;
                var url = "/smart_lock/v1/role/find_list";
                var type = "post";
                $$vue.loading = true;
                PAGE.ajax({
                    url: url,
                    async: false,
                    type: type,
                    data: $$vue.role_params,
                    success: function (ret) {
                        if (!ret) {
                            return;
                        }
                        if (ret.page_number == 1 && (!ret.list || ret.list.length == 0)) {
                            $.tips("请先添加角色", "warn", function () {
                                window.location.href = "/#/web/roleList.html";
                            });
                        }
                        $$vue.role_list = ret.list || [];
                        listMap["role"] = listMap["role"] || [];
                        listMap["role"] [$$vue.role_params.page_number] = ret.list;
                        $$vue.roleTotalPage = ret.total_page;
                        $$vue.list = $$vue.mergeArray(listMap["role"]);
                    }, complete: function () {
                        $$vue.loading = false;
                    }
                });
            },
            refreshPersonList: function () {
                var $$vue = this;
                var url = "/smart_lock/v1/user/find_list";
                var type = "post";
                if ($$vue.personLoading) {
                    return;
                }
                $$vue.personLoading = true;
                PAGE.ajax({
                    async: false,
                    url: url,
                    data: this.person_list_params,
                    type: type,
                    success: function (ret) {
                        if (!ret) {
                            return;
                        }
                        $$vue.person_list = ret.list || [];
                        listMap["person"] = listMap["person"] || [];
                        listMap["person"] [$$vue.person_list_params.page_number] = ret.list;
                        $$vue.personTotalPage = ret.total_page;
                        $$vue.list = $$vue.mergeArray(listMap["person"]);

                    },
                    complete: function () {
                        $$vue.personLoading = false;
                    }
                });
            },
            refreshDeviceList: function () {
                var $$vue = this;
                var url = "/smart_lock/v1/device/find_list";
                var type = "post";
                if ($$vue.deviceLoading) {
                    return;
                }
                $$vue.deviceLoading = true;
                PAGE.ajax({
                    async: false,
                    url: url,
                    data: this.device_list_params,
                    type: type,
                    success: function (ret) {
                        if (!ret) {
                            return;
                        }
                        $$vue.device_list = ret.list || [];
                        listMap["device"] = listMap["device"] || [];
                        listMap["device"] [$$vue.device_list_params.page_number] = ret.list;
                        $$vue.deviceTotalPage = ret.total_page;
                        $$vue.list = $$vue.mergeArray(listMap["device"]);

                    },
                    complete: function () {
                        $$vue.deviceLoading = false;
                    }
                });
            },
            toM:function (val) {
                return Math.floor($.trim(val)||0);
            },
            addSelectItem:function (index) {
                var curTimeList = this.timeSelectList[index];

                if ((curTimeList.end_time * 1) <= (curTimeList.start_time * 1)) {
					$module.find(".timeSelectListItem").eq(index).removeClass("validSuccess").addClass("validError");
					$module.find(".timeSelectListItem").eq(index).find(".J-valid-msg").html(curTimeList.title+"结束时间必须大于开始时间!");
                    return
                }
				if(!this.insertSelectItemValue(curTimeList.selectTime,curTimeList.start_time,curTimeList.end_time)){
					$module.find(".timeSelectListItem").eq(index).removeClass("validSuccess").addClass("validError");
					$module.find(".timeSelectListItem").eq(index).find(".J-valid-msg").html(curTimeList.title+"已经有选时间段!");
				}

            },
			insertSelectItemValue:function (selectTime,start_time,end_time) {
				start_time = start_time*1;
				end_time = end_time*1;
			for(var i=0;i<selectTime.length;i++){
				var isLeft = start_time<selectTime[i].start_time&&end_time<=selectTime[i].start_time;
				var isRight = start_time>=selectTime[i].end_time&&end_time>selectTime[i].end_time;
				if(isLeft||isRight){
					if(isLeft){
						selectTime.splice(i,0,{
							start_time:start_time * 1,
								end_time:end_time * 1,
								value: this.toM(start_time) + "_" +this.toM(end_time),
								name:this.minuteFormat(start_time) + "~" +this.minuteFormat(end_time)
						});
						return true;
					}
					if(isRight&&(selectTime.length==i+1)){
						selectTime.push({
							start_time:start_time * 1,
							end_time:end_time * 1,
							value: this.toM(start_time) + "_" +this.toM(end_time),
							name:this.minuteFormat(start_time) + "~" +this.minuteFormat(end_time)
						});
						return true;
					}

				}

				return false;
			}
				if(selectTime.length==0){
					selectTime.push({
						start_time:start_time * 1,
						end_time:end_time * 1,
						value: this.toM(start_time) + "_" +this.toM(end_time),
						name:this.minuteFormat(start_time) + "~" +this.minuteFormat(end_time)
					});
					return true;
				}
			},
			addSelectItemByValue:function (index,value) {
				if(value){
					var timeArr = value.split(",")||[];
					for(var i=0; i<timeArr.length;i++){
						if(timeArr[i]){
							var time = timeArr[i].split("_")||[];
							if(time.length==2){
								this.insertSelectItemValue (this.timeSelectList[index].selectTime,time[0],time[1]);
							}
						}

					}
				}

			},
            delSelectItem:function (parentIndex,index) {
                this.timeSelectList[parentIndex].selectTime.splice(index,1);
            },
            initSelectItemEvent:function ($module) {
                var $$vue = this;
              $module.on("click",".timeSelectAdd",function () {
                $$vue.addSelectItem($(this).data("index"))
              }).on("click",".timeSelectClose",function () {
                  $$vue.delSelectItem($(this).data("index"),$(this).data("item-index"))
              })
            },
            initSubmit: function () {
                //表单注册
                var $$vue = this;
                $module.validForm({
                    success: function ($btn) {
                        var params="";
                        for(var i=0;i<$$vue.timeSelectList.length;i++){
                            var curTimeList = $$vue.timeSelectList[i];
                            var curTimeValue = [];
                            $(".timeSelectListItemValue").eq(i).find(".itemValue").each(function () {
                                curTimeValue.push($(this).data("value"));
                            })
                            params +=  "&"+curTimeList.name+"=" + curTimeValue.join(",");
                        }
                        PAGE.ajax({
                            data: $module.serialize() + params + "&token=" + token,
                            type: 'post',
                            url: "/smart_lock/v1/strategy/add",
                            success: function (ret) {
                                $.dialog.closeAll();
                                $.tips("添加成功！", "success");
                                $relativeModule.trigger("listupdate");
                            }
                        })
                    }
                });

            },


        },
        mounted: function () {
            this.$nextTick(function () {
                this.refreshRoleList();
                this.refreshPersonList();

                this.initAllowTime();
                $module = $("#" + moduleId);
                this.initSubmit();
                this.initSelectItemEvent($module);
                $module.find(".J-scroll.role").on("scrollDown", function () {
                    if (!$$vue.roleLoading) {
                        $$vue.getRoleNextPage();
                    }
                });
                $module.find(".J-scroll.person").on("scrollDown", function () {
                    if (!$$vue.personLoading) {
                        $$vue.getPersonNextPage();
                    }
                });
                $module.find(".J-scroll.device").on("scrollDown", function () {
                    if (!$$vue.deviceLoading) {
                        $$vue.getDeviceNextPage();
                    }
                });
            })
        }
    });


    PAGE.destroy.push(function () {
        if ($$vue) {
            $("body").off("scrollDown." + moduleId);
            $$vue.$destroy();
            listMap = null;
            $$vue = null;
            $module = null
        }
    })
})
;