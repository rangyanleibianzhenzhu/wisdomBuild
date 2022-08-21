# 模拟后台接口服务
在后台接口未开发完成时，可以根据接口文档，通过此服务模拟后台接口。

## 一、启动服务
```bash
# 启动模拟后台接口服务
npm run mock:server
```

## 二、使用方式
模拟接口方式有两种：
1. 通过json数据模拟接口
2. 通过js方式模拟接口
 
#### 1. json数据模拟接口
###### 1) 固定路径
>示例:
 * 接口路径为 /api/user/getUser
 * 添加文件 /mock/json//api/user/getUser.json 来设置接口返回的数据
###### 2) 路径的最后一级为动态参数（如果除了路径最后一级还有动态参数需要使用js的方式来模拟接口）
>示例:
 * 接口路径为 /api/role/{roleId}
 * 添加文件 /mock/json//api/role/$.json 来设置接口返回的数据
###### 3) 指定数据用例
 * 如果不同的业务场景下需要返回的数据不同，可以增加新的数据用例。数据用例可以在/mock/app/cases/sysCase.js 文件中添加，也可以增加新的数据用例组。
> 示例:
 * /api/user/getUser 接口用来获取当前用户信息，默认返回 /mock/json//api/user/getUser.json 的数据，此数据是普通用户的信息。但是有时需要使用管理员的数据来实现交互场景，就需要单独设置管理员的数据用例。
    1) 在相同的目录下增加新的数据文件
    * 例如：/mock/json//api/user/getUser_admin.json
    * “_”后面的后缀是自定义的
    2) 在数据用例组中增加数据用例，如下：
    ```
    // 系统 - 管理员登录
    'adminLogin': {
      // 'admin' 指 getUser_admin.json 文件名 “_” 后面的自定义后缀
      '/api/user/getUser': 'admin' 
    }
    ```
    3) /mock/app/json-mock-case.js 中配置当前使用的数据用例
    ```
    // 当前用例(可以同时使用多个数据用例)
    curCases: ['adminLogin']
    ```

#### 2. js方式模拟接口
js方式是通过express来实现模拟接口的，在json方式不能实现时使用，集成了mockjs
