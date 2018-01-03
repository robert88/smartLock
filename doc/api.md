## 接口文档
## 一、解释说明
### 1.1 host：http://smart-api.kitcloud.cn/ (后端已经设置了CORS，解除了跨域的问题)
## 二、用户管理
### 2.1添加用户
|  POST  |  smart_lock/v1/user/add  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_email | String | 是 | 用户邮箱 | 长度必须小于50 |
|  user_name | String | 是 | 用户昵称 | 长度必须小于30 |
|  login_pwd | String | 是 | 登录密码 | 登录密码必须包含字母数字，长度最小8位 |
|  user_phone | String | 是 | 账户用户手机号 | 必须是纯数字，长度最少11位，小于20位 |
| address | String | 否 | 用户地址 | 小于40个字符 |
|  role_id | Integer | 是 | 角色ID | 如果账户类型是管理员，该值默认填-1 |
|  type | Integer | 是 | 账户类型 | 10：超级管理员；11：普通管理员；12：普通人员 |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"添加成功"//错误原因
}
```
### 2.2 删除用户
|  POST  |  smart_lock/v1/user/delete  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_id | Interger | 是 |  用户id  | 整形 |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"删除成功"//错误原因
}
```
### 2.3 查询用户信息
|  POST  |  smart_lock/v1/user/find  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_id | Interger | 是 |  用户id  | 整形 |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"删除成功"//错误原因
	"data":{
		"id":123,
		"user_email":"xxxx@xxx.com",
		"user_name":"test",
		"update_pwd_time" : "2016-11-11 11:11:11", //最后一次密码更新时间 
		"user_phone": "13401111111",
		"role_id": 1234, //角色ID
		"type": 10,
		"consumer_id":23456,
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}
}
```
### 2.4 修改用户信息
|  POST  |  smart_lock/v1/user/modify  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_id | Interger | 是 |  用户id  | 整形 |
|  user_email | String | 否 | 用户邮箱 | 长度必须小于50 |
|  user_name | String | 否 | 用户昵称 | 长度必须小于30 |
|  user_phone | String | 否 | 账户用户手机号 | 必须是纯数字，长度最少11位，小于20位 |
|  role_id | Integer | 否 | 角色ID | 如果账户类型是超级管理员，该值默认填-1,切不可更改 |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"修改成功"//错误原因
}
```
### 2.5 修改用户密码
|  POST  |  smart_lock/v1/user/modify_pwd  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_id | Interger | 是 |  用户id  | 整形 |
|  password | String | 是 | 密码 | |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"修改成功"//错误原因
}
```
### 2.6 查询用户列表
|  POST  |  smart_lock/v1/user/find_list  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_name| String | 否 |  客户名称  |  |
| page_size | Interger | 是 | 每页数量 | |
|page_number | Interger |是 | 页数 ||


**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": {
  	"page_number": 1,
  	"page_size": 2,
  	"total_page": 10,
  	"total_row": 100,
  	"list": [{
		"id":123,
		"user_email":"xxxx@xxx.com",
		"user_name":"test",
		"update_pwd_time" : "2016-11-11 11:11:11", //最后一次密码更新时间 
		"user_phone": "13401111111",
		"consumer_id",23456,
		"role_id": 1234, //角色ID
		"type": 10,
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}]
  }
}
```
### 2.7 用户注册
|  POST  |  smart_lock/v1/member/register  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  email | String | 是 |  用户邮箱  | 字符串 |
|  password | String | 是 |  用户密码 | 字符串 |
|  name | String | 是 |  用户昵称  | 字符串 |
|  address | String | 是 |  用户地址 | 字符串 |
|  phone | String | 是 |  用户手机号  | 字符串 |
|  code | String | 是 |  短信验证码 | 字符串 |

**返回**
``` 
{
    "code": 200,
    "data": {
        "token": "5aykcNL79ds=" // 用户验证token
    },
    "msg": "注册成功"
}
```

### 2.8 用户登录
|  POST  |  smart_lock/v1/member/login  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  email | String | 是 |  用户邮箱  | 字符串 |
|  password | String | 是 |  用户密码 | 字符串 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": {
  		"token": '用户生成的安全串'
  }
}
```
### 2.9 获取图形验证码
|  GET  |  smart_lock/v1/member/captcha  |
| ------------- |:-------------:|

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  width | Int | 否 |  图片的宽度，默认值为100  | 整型 |
|  height | Int | 否 |  图片的长度。默认值为30  | 整型 |

**返回**
``` 
{
    "code": 200,
    "data": {
        "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAeCAMAAADthUvBAAAAP1BMVEUAAAAuEn1xVcCRdeBbP6ojB3JnS7aAZM+bf+peQq0oDHeUeONyVsGcgOteQq1KLpkjB3JRNaCKbtkxFYCWeuWgaUMkAAAAAXRSTlMAQObYZgAAAX5JREFUeJy0lm3OrCAMhXtiNGoYg3H/e70ZBemXgs59+0dF6HNaSpXuba28/x+2rn9HAYBE8d83e4p3COSr588fdRlRUZZT5uED2azX15Esy3K4TozkCdysk6kZd0aSZEvVJXdkaNP0lEIIliFSxYM6hh8w0qoQQhWiaE/DAMAYYxnnc5goXoWtCHE8aBxHIdlOJpW+Bsa5KI+Mp7+gnbCnvDctFLGfKj/fjdIQo+4SAw8CvuC4BuXX3SVbMBfocg6PJSwoWWLejCuKQSgNvkpZYUTU3UeCe0iZ4x2VrKPrOt3eYFQSbZ4QlI3Z3wVXy/epI4oisbp6dsa2OXH2rAqQm4Hobrl0gRjjWZpOzkokyvq+lxUXWIMsehMw0qOvTKGQzSt5+6v34ndz6/5aQJuxT3yUbmwjegthPyv711rWr4G8pZRb/d8BDKb/vszXjQ3DUA5ThvxM+WhKuUX1nLQyPpqSbC59vOokVCkXjHlOd3XI3jhe2Vyd8S8AAP//RAsGD2kc0TEAAAAASUVORK5CYII="
    },
    "msg": "生成成功"
}
``` 
### 2.10 获取短信验证码
|  POST  |  smart_lock/v1/member/sms  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  phone | String | 是 |  用户手机号  | 字符串 |
|  type | String | 否 |  类型，默认为register | 字符串 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码
}
```
### 2.11 验证帐号是否存在（找回密码第一步)
|  POST  |  smart_lock/v1/member/forget_password  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  captcha | String | 是 | 图形验证码| 字符串 |
|  email | String | 否 |  用户邮箱  | 字符串 |
|  phone | String | 否 |  用户手机号 | 字符串 |
PS： email与phone二者必须输入一个

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": {
  		"hash": '帐号验证通过的hash值，用于下一步修改密码'
  }
}
```
### 2.12 设置新密码(找回密码第二步)
|  POST  |  smart_lock/v1/member/reset_password  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  hash | String | 是 | 第一步验证帐号时，获得的hash值| 字符串 |
|  code | String | 是 |  短信验证码或者邮箱验证码  | 字符串 |
|  password | String | 是 |  用户新密码 | 字符串 |
|  repassword | String | 是 |  用户确认密码 | 字符串 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码
}
```

### 2.13 查询删除用户列表
|  POST  |  smart_lock/v1/user/find_delete_list  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  userId_name | string | 否 |  客户名称  |  |
| page_size | Interger | 是 | 每页数量 | |
| page_number | Interger |是 | 页数 ||

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": {
  	"page_number": 1,
  	"page_size": 2,
  	"total_page": 10,
  	"total_row": 100,
  	"list": [{
		"id":123,
		"user_email":"xxxx@xxx.com",
		"user_name":"test",
		"update_pwd_time" : "2016-11-11 11:11:11", //最后一次密码更新时间 
		"user_phone": "13401111111",
		"consumer_id",23456,
		"role_id": 1234, //角色ID
		"type": 10,
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}]
  }
}
```
### 2.14 恢复删除用户
|  POST  |  smart_lock/v1/user/recover_user  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  user_id | Interger | 是 |  客户id  | 整形 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
## 三、设备控制
###  3.1 单个设备开锁
|  POST  |  smart_lock/v1/device_control/singal_open  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_code | String  | 是 | 设备硬件唯一编码 |   |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```
### 3.2 多个设备开锁
|  POST  |  smart_lock/v1/device_control/batch_open  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_codes | String  | 是 | 逗号分割的设备硬件编码集合 |  11111,22222    |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```

### 3.3 开启整个组的设备
|  POST  |  smart_lock/v1/device_control/group_open  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  group_id | Interger  | 是 | 分组编号 |      |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```

### 3.4 关闭单个设备
|  POST  |  smart_lock/v1/device_control/singal_close  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_code | String   | 是 | 设备硬件编码 |      |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```
### 3.5 关闭多个设备
|  POST  |  smart_lock/v1/device_control/batch_close  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_codes | String   | 是 | 设备硬件编码集合 | 1111,22222      |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```

### 3.6 按组关闭设备
|  POST  |  smart_lock/v1/device_control/group_close  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  group_id| Interger   | 是 | 分组编码 |      |

**返回**

``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```

### 3.7 设置单个设备状态
|  POST  |  smart_lock/v1/device_control/singal_status  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_code | String   | 是 | 设备硬件编号 |      |
|  status  | Interger   | 是 | 状态编号  | 10：常开，11：常闭；12：半开；    |

**返回**

``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```
### 3.8 设置多个设备状态

|  POST  |  smart_lock/v1/device_control/singal_status  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_codes | String   | 是 | 设备硬件编码集合 |      |
|  status  | Interger   | 是 | 状态编号  | 10：常开，11：常闭；12：半开；    |

**返回**

``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```

### 3.9 按组设置设备状态
|  POST  |  smart_lock/v1/device_control/singal_status  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  group_id | Interger   | 是 | 分组编号 |      |
|  status  | Interger   | 是 | 状态编号  | 10：常开，11：常闭；12：半开；    |

**返回**

``` 
{
	"code":200,//错误代码
	"msg":"发送成功"//错误原因
}
```

## 四、设备管理
### 4.1 添加设备（pc端）
|  POST  |  smart_lock/v1/device/add_by_user  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_code  | String   | 是 | 设备硬件唯一编码  |  |
|  device_name | String | 是 | 设备名称 | |
| device_model| String | 是 | 设备型号 | |

**ps：添加该设备的用户对该设备有所有权限**
**返回**

``` 
{
	"code":200,//错误代码
	"msg":"添加成功"//错误原因
}
```
### 4.2 添加设备（设备端）
|  POST  |  smart_lock/v1/device/add_by_device  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_code  | String   | 是 | 设备唯一编码  |  |

**返回**

``` 
{
	"code":200,//错误代码
	"msg":"添加成功"//错误原因
}
```
### 4.3 分配设备给某个用户
|  POST  |  smart_lock/v1/device/device_auth |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_id  | Interger   | 是 | 设备id  |  |
| user_id | Interger | 是 | 用户id | |

**返回**

``` 
{
	"code":200,//错误代码
	"msg":"添加成功"//错误原因
}
```
### 4.4 查询设备信息
|  POST  |  smart_lock/v1/device/find  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_id | Interger | 是 |  设备id  | 整形 |

**返回**
``` 
{
	"code":200,//错误代码
	"msg":"删除成功"//错误原因
	"data":{
		"id":123,
		"name":"测试设备",
		"device_code":"123123",
		"device_model":"x1",//设备型号
		"group_id":34,//该设备分组id
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}
}
```
### 4.5 查询设备列表
|  POST  |  smart_lock/v1/device/find_list  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- |: -------- | -------- | -------- | ---- |
| page_size | Interger | 是 | 每页数量 | |
|page_number | Interger |是 | 页数 ||
| device_name | String | 否 | 设备名称| |
| device_code | String | 否 | 设备编码 | |

**ps 返回该用户有控制权限的设备 **
**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": {
  	"page_number": 1,
  	"page_size": 2,
  	"total_page": 10,
  	"total_row": 100,
  	"list": [{
		"id":123,
		"name":"测试设备",
		"device_code":"123123",
		"device_model":"x1",//设备型号
		"group_id":34,//该设备分组id
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}]
  }
}
```
### 4.6 修改设备信息
|  POST  |  smart_lock/v1/device/modify  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_id | Interger | 是 |  设备id  |  |
| device_name | String | 否 | 设备名称 | |
| device_model | String | 否|设备型号 | |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.7 删除设备
|  POST  |  smart_lock/v1/device/delete  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_id | Interger | 是 |  设备id  | 会走手机验证流程 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.8 创建设备分组
|  POST  |  smart_lock/v1/device_group/add  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  group_name | String | 是 |  分组名称 || 

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.9 修改设备分组
|  POST  |  smart_lock/v1/device_group/modify  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| group_name | String | 是 |  分组名称  |  |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.10 删除设备分组
|  POST  |  smart_lock/v1/device_group/delete  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| group_id| Interger | 是 |  分组id  |  |

**ps：分组被删除，该分组下的设备会处于未分组状态**
**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.11 查询分组列表
|  POST  |  smart_lock/v1/device_group/find_list  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| group_name| String | 否 |  分组名称  |  |
| page_size | Interger | 是 | 每页数量 | |
|page_number | Interger |是 | 页数 ||

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data":{
    	"page_number": 1,
    	"page_size": 2,
    	"total_page": 10,
    	"total_row": 100,
    	"list": [{
  		"id":1,//分组id
		 "group_name":"分组1"//分组名称
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}]
  }
}
```
### 4.12 查询分组信息
|  POST  |  smart_lock/v1/device_group/find  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| group_id| Interger | 是 |  分组id  |  |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
    "data":{
    "id":1,//分组id
    "group_name":"分组1"//分组名称
  }
}
```
### 4.13 分组添加设备
|  POST  |  smart_lock/v1/device_group/add_device  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| group_id| Interger | 是 |  分组id  |  |
|device_ids | String |是 | 设备id集合| 2345,3456|

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.14 分组删除设备
|  POST  |  smart_lock/v1/device_group/delete_device  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| group_id| Interger | 是 |  分组id  |  |
|device_ids | String |是 | 设备id集合| 2345,3456|

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 4.15 查询分组下设备列表
|  POST  |  smart_lock/v1/device_groupu/find_device  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  group_id | Interger | 是 |  分组id  | 返回该用户有控制权限的设备 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": [{
		"id":123,
		"name":"测试设备",
		"device_code":"123123",
		"device_model":"x1",//设备型号
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11,
  }]
}
```
### 4.16 设置设备告警电话
|  POST  |  smart_lock/v1/device/set_warnning_num  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_id | Interger | 是 |  设备id  |  |
| mobile_num | String | 是 | 手机号码 | 1234567897,25252622642 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
## 五、 设备连接
### 5.1 websocket连接
|  POST  |  smart_lock/v1/ws/connect  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  device_code  | String   | 是 | 设备唯一编码  |  |

**返回**

``` 
"connect succes "//如果失败，返回"connect faild"
```
## 六、角色管理
### 6.1 添加角色
|  POST  |  smart_lock/v1/role/add  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  role_name | String | 是 |  角色名称  | |
| consumer_id |  Interger | 是 | 客户id | | 

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data":{
  	"role_id":123,//角色id
  	"role_name":"普通员工",
  	"consumer_id":2345,
  }
}
```
### 6.2 删除角色
|  POST  |  smart_lock/v1/role/delete  |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  role_id | Interger | 是 |  角色id  | |

**返回**
``` 
{ 
  "msg": "删除成功", //错误原因 
  "code": 200 //业务码,
}
```
### 6.3 查询角色列表
|  POST  |  smart_lock/v1/role/find_list|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|role_name | String | 否 | 角色名称 | |
| page_size | Interger | 是 | 每页数量 | |
|page_number | Interger |是 | 页数 ||

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
  "data": {
  	"page_number": 1,
  	"page_size": 2,
  	"total_page": 10,
  	"total_row": 100,
  	"list": [{
  		"id":123,
		"name":"普通员工",
		"update_time": "2016-11-11 11:11:11",
		"create_time": "2016-11-11 11:11:11"
	}]
  }
}
```
### 6.4 添加权限
|  POST  |  smart_lock/v1/role/add_access|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
| role_id | Interger | 是 | 用户id | |
|  access_id | Interger | 是 |  权限id  |  |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
}
```
### 6.5 修改权限
### 6.6  删除权限
## 七、策略管理
### 7.1 创建策略
|  POST  |  smart_lock/v1/strategy/add|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  strategy_name | String | 是 | 策略名称  |  |
| role_id | Interger | 是 | 有权限角色id | |
| user_id | Interger | 是 | 有权限用户id | |
| allow_time | String | 是 | 允许操作时间段 | 以0点开始，分为单位的时间段，如零点半到一点允许，即30_60 |
| allow_openmode | String | 是 |允许开锁方式 | 逗号隔开，11，12，13|
| allow_operation | String | 是 |允许的操作| 暂定开和关两种，开门：11，关门：12。如 11，12 即开和关都允许 |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
}
```
### 7.2 查询策略
|  POST  |  smart_lock/v1/strategy/find |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  strategy_id | Interger |是 | 策略id  |  |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
  "data":{
  	"strategy_name":"策略1",//策略名称
  	"role_id":2,
  	"user_id":5,
  	"allow_time":"60_120",
  	"allow_openmode":"11,12",
  	"allow_operation":"11",
  	"update_time":"2017-12-12 00:00:00",
  	"create_time":"2017-12-12 00:00:00"
  }
}
```
### 7.3 删除策略
|  POST  |  smart_lock/v1/strategy/delete |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  strategy_id | Interger | 是 | 策略id  |  |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
}
```
### 7.4 修改策略
|  POST  |  smart_lock/v1/strategy/modify|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  strategy_id | Interger | 是 | 策略id  |  |
|  strategy_name | String | 否 | 策略名称  |  |
| role_id | Interger | 否 | 有权限角色id | |
| user_id | Interger | 否 | 有权限用户id | |
| allow_time | String | 否 | 允许操作时间段 | 以0点开始，分为单位的时间段，如零点半到一点允许，即30_60 |
| allow_openmode | String | 否 |允许开锁方式 | 逗号隔开，11，12，13|
| allow_operation | String | 否 |允许的操作| 暂定开和关两种，开门：11，关门：12。如 11，12 即开和关都允许 |

**返回**
``` 
{ 
  "msg": "", //错误原因 
  "code": 200 //业务码,
}
```
### 7.5 查询策略列表
|  POST  |  smart_lock/v1/strategy/find |
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  strategy_name | String | 否 | 策略名称  |  |
| page_size | Interger | 是 | 每页数量 | |
|page_number | Interger |是 | 页数 ||

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
  "data":{
  	"page_number": 1,
  	"page_size": 2,
  	"total_page": 10,
  	"total_row": 100,
  	"list": [{
  		"id":123,
  		"strtegy_name":"策略1",//策略名称
  		"role_id":2,
  		"user_id":5,
  		"allow_time":"60_120",
  		"allow_openmode":"11,12",
  		"allow_operation":"11",
  		"update_time":"2017-12-12 00:00:00",
  		"create_time":"2017-12-12 00:00:00"
	}]
  }
}
```
## 八、情景模式
### 8.1 创建情景模式
|  POST  |  smart_lock/v1/situational_mode/add|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  situational_name | String | 是 | 情景模式名称  |  |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
}
```
### 8.2 情景模式绑定策略
|  POST  |  smart_lock/v1/situational_mode/add_strategy|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  situational_id | Interger | 是 | 情景模式id  |  |
| strategy_id| Interger | 是| 策略id |  |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
}
```
### 8.3 设备分组切换情景模式
|  POST  |  smart_lock/v1/situational_mode/modify_group|
| ------------- |:-------------:| 

**请求参数：**

|  参数名称 | 参数类型 | 是否必填 | 参数描述 | 备注 |
|  -------- | -------- | -------- | -------- | ---- |
|  situational_id | Interger | 是 | 情景模式id  |  |
| group_ids| String | 是| 逗号分割的分组id | 234,345 |

**返回**
``` 
{ 
  "msg": "添加成功", //错误原因 
  "code": 200 //业务码,
}
```
## 九、操作日志
### 9.1 上传日志
### 9.2 日志查询
## 十、微信操作