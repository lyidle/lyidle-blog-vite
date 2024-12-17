# 搭建博客心得

## 前端

### 初始化前端框架

```ts
📦lyidle-blog-vite
 ┣ 📂config
 ┃ ┗ 📂vite.config
 ┃ ┃ ┣ 📜build.ts
 ┃ ┃ ┗ 📜plugin.ts
 ┣ 📂public
 ┃ ┗ 📂static
 ┃ ┃ ┣ 📂cursor
 ┃ ┃ ┃ ┣ 📂dark
 ┃ ┃ ┃ ┗ 📂light
 ┃ ┃ ┣ 📂font
 ┃ ┃ ┗ 📂images
 ┃ ┃ ┃ ┗ 📜vite.svg
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┣ 📂assets
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂icon
 ┃ ┣ 📂directive
 ┃ ┣ 📂hooks
 ┃ ┣ 📂layout
 ┃ ┃ ┗ 📜index.vue
 ┃ ┣ 📂router
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜routes.ts
 ┃ ┣ 📂store
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂styles
 ┃ ┃ ┣ 📜global.scss
 ┃ ┃ ┗ 📜variable.scss
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📜debounce.ts
 ┃ ┃ ┣ 📜localStorage.ts
 ┃ ┃ ┣ 📜request.ts
 ┃ ┃ ┣ 📜throttle.ts
 ┃ ┃ ┗ 📜zh-moment.ts
 ┃ ┣ 📂views
 ┃ ┃ ┗ 📂404
 ┃ ┃ ┃ ┗ 📜index.vue
 ┃ ┣ 📜App.vue
 ┃ ┣ 📜main.ts
 ┃ ┣ 📜plugins.ts
 ┃ ┗ 📜vite-env.d.ts
 ┣ 📜.env.development
 ┣ 📜.env.production
 ┣ 📜.env.test
 ┣ 📜.gitignore
 ┣ 📜index.html
 ┣ 📜package.json
 ┣ 📜pnpm-lock.yaml
 ┣ 📜tsconfig.app.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┣ 📜uno.config.ts
 ┗ 📜vite.config.ts
```

> [!abstract]
>
> 1. 使用 `normalize.css` + `scss` 初始化样式
> 2. 使用 `unocs、@iconify/json、@unocss/preset-icons` 实现图标使用 `class` 按需加载
> 3. 配置自动按需导入 `unplugin-auto-import、unplugin-vue-components、unplugin-element-plus、element-plus` 实现 `component` 下的组件便捷导入，`element-plus` 的按需加载
>    * `element-plus` 主要是 `button、switch` 等方便封装改变颜色
>    * 自动导入 `components` 下的组件
> 4. 配置快速命名组件 `vite-plugin-vue-setup-extend` 在 `setup` 中使用 `name=“componentName”` 来命名
> 5. 预配置 `axios` 进行封装发起请求、`lodash` 的深度克隆等、`moment` 实现时间快速格式化、`pinia` 实现仓库管理

### 参考

> [!abstract]  界面参考
>
> [Fomalhaut](https://www.fomal.cc/)

> [!abstract]  组件参考
>
> 

### 正则

```ts
// 正则
// 账号长度大于3位 不能重复
// 密码
const passReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@,_.])[a-zA-Z0-9$@,_.]{6,12}$/
// 邮箱
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 验证码正则
const codeReg = /^[0-9]{6}$/
```

## 后端搭建

### 初始化框架

```ts
📦lyidle-blog-node
 ┣ 📂src
 ┃ ┣ 📂@types
 ┃ ┃ ┗ 📂express
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂init
 ┃ ┃ ┣ 📂hash
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┗ 📂middleWare
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂mock
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┗ 📜notify.ts
 ┃ ┃ ┗ 📜menulist.ts
 ┃ ┣ 📂router
 ┃ ┃ ┗ 📂api
 ┃ ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┣ 📂reg
 ┃ ┃ ┃ ┃ ┣ 📜email.ts
 ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┗ 📜type.ts
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📜app.ts
 ┃ ┗ 📜config.json
 ┣ 📜package.json
 ┣ 📜pnpm-lock.yaml
 ┗ 📜tsconfig.json
```

> [!abstract]
>
> 1. 使用 `express` 来搭建服务
> 2. 使用 `@types/express @types/node typescript`  实现 `typescript` 开发
> 3. 使用 `tsconfig-paths tsc-alias` 来进行路径的别名配置

### api

正确的返回 `code:200`

#### 正则

```ts
// 密码
const passReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@,_.])[a-zA-Z0-9$@,_.]{6,12}$/
// 邮箱
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 验证码正则
const codeReg = /^[0-9]{6}$/
```

#### 注册

> [!value]  post 携带参数 json `/api/reg`

```json
{
    "account": "testUser",//账号大于等于3位
    "email": "test@qq.com",// 需要是 字母数字(_-.)开头 中间 @字母数字(_-.) 以2-4个字母结尾 
    "code": "132456",//六位数的数字 使用 outlook邮箱发送 并验证
    "password": "132456@aA",//包含 大小写字母、数字、特殊符号($@,_.)中的一个
    "confirmPassword": "132456@aA"  //需要与密码一致
}
```

##### 返回值

* `401`  : 注册失败

#### 邮箱

> [!value]  post 携带参数 urlencoded `/api/reg/email`

参数名 :  ==email==

值 ： ==邮箱==

需要符合正则表达式

##### 返回值

* `401` : 发送邮件失败

#### 登录

> [!value]  get 携带参数 json `/api/login`

```ts
{
    "account": "testUser",//账号大于等于3位
    "password": "132456@aA"//包含 大小写字母、数字、特殊符号($@,_.)中的一个
}
```

##### 流程

> [!abstract]
>
> 第一步：用户发送邮箱、账号、密码。
> 第二步：基础验证
> 第三步：接收 login，而不接收email和username.
> 第四步：通过 login查询数据库，判断用户存在。
> 第五步：验证密码是否正确。
> 第六步：验证是不是管理员。
> 第七步：使用jwt的包，生成 token。
