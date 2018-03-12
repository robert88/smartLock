
$(function () {

    var token = PAGE.getToken();
    if (!token) {
        return;
    }
    var curAccordEmail = $.cookie("user_email");
    var moduleId = "multiTimeModule";
    var moduleVueId = moduleId;
    var $module = $("#" + moduleId);
    var listMap = {};

    var $$vue = new Vue({
        el: "#" + moduleVueId,
        data: {
            role_list: [],
            roleLoading:false,
            roleTotalPage:0,
            role_params: {page_number: 1, page_size: 10, role_name: "",  token: token},

            person_list:[],
            personLoading:false,
            personTotalPage:0,
            person_list_params:{page_number:1,page_size:10,user_name:"",token:token},

            allow_start_time_list:[],
            allow_end_time_list:[],
            start_time:0,
            end_time:0,
            allow_openmode_list:[{id:"11",name:"远程控制"},{id:"12",name:"密码"}],
            allow_operation_list:[{id:"11",name:"开门"},{id:"12",name:"关门"}]
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
            "start_time": function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.allow_end_time_list =[];
                    var curTime = new Date("2018/02/04").getTime();

                    for(var i=0;i<=48;i++){
                        if((i/2)>newValue){
                            if(i==48){
                                this.allow_end_time_list.push({name:"24:00",id:i/2});
                            }else{
                                this.allow_end_time_list.push({name:(curTime+i/2*60*60*1000).toString().toDate().format("hh:mm"),id:i/2});
                            }
                        }

                    }
                }
            }
        },
        methods: {
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
            filter: function () {
                $module.find(".search-filter-wrap").toggleClass("open");
            },
            isSelf: function (email) {
                if (email && (email == curAccordEmail)) {
                    return false;
                }
                return true;
            },
            initAllowTime:function () {
                var curTime = new Date("2018/02/04").getTime();
                for(var i=0;i<=48;i++){
                    if(i==48){
                        this.allow_start_time_list[i] = {name:"24:00",id:i/2}
                        this.allow_end_time_list[i] = {name:"24:00",id:i/2}
                    }else{
                        this.allow_start_time_list[i] = {name:(curTime+i/2*60*60*1000-turnTime).toString().toDate().format("hh:mm"),id:i/2}
                        this.allow_end_time_list[i] = {name:(curTime+i/2*60*60*1000-turnTime).toString().toDate().format("hh:mm"),id:i/2}
                    }
                }
            }

        },
        mounted: function () {
            this.$nextTick(function () {
                this.initAllowTime();
                $module = $("#" + moduleId);

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
