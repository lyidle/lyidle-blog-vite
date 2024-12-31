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
>    - `element-plus` 主要是 `button、switch` 等方便封装改变颜色
>    - 自动导入 `components` 下的组件
> 4. 配置快速命名组件 `vite-plugin-vue-setup-extend` 在 `setup` 中使用 `name=“componentName”` 来命名
> 5. 预配置 `axios` 进行封装发起请求、`lodash` 的深度克隆等、`moment` 实现时间快速格式化、`pinia` 实现仓库管理

### 参考

> [!abstract] 界面参考
>
> [Fomalhaut](https://www.fomal.cc/)

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
> 2. 使用 `@types/express @types/node typescript ts-node-dev` 实现 `typescript` 开发
> 3. 使用 `tsconfig-paths` 来进行开发时路径的别名配置
> 4. 使用 `connect-history-api-fallback` 处理 `vue history`白屏
> 5. 使用 `dotenv` 实现环境变量的配置
> 6. 使用 `jsonwebtoken express-jwt` 来处理 `token`
> 7. 使用 `bcryptjs` 加密密码
> 8. 使用 `device-detector-js ip` 实现统计访客数量
> 9. 使用 `ms` 处理 时间转换 `s、h、d` 到 毫秒的互转
> 10. 使用 `dayjs` 处理时间格式，主要是邮件发送展示的时间需要
> 11. 使用 `morgan` 记录日志
> 12. 使用 `sequelize sequelize-cli mysql2` 来处理 `mysql` 数据库
> 13. 使用 `copyfiles、rimraf` 来处理 `ts` 打包问题
> 14. 使用 `concurrently` 同时开启 接口和网站 的运行
> 15. 使用自定义替换别名打包 询问 gpt + 自己改了点错误 别名只配了一个 `“@/*”` 代表 `/src`
>     - 使用 `tsc-alias` 引入的 `js` 文件使用别名没有替换，使用了 `sequelize-cli` 自动生成的是 `js` 文件
>     - 或者使用 `module-alias` 替换也行
> 16. 使用 `minify` 压缩代码

> [!value] script

```json
{
  "scripts": {
    "build": "rimraf dist && tsc && tsc-alias && copyfiles -u 1 src/**/*.* dist --exclude \"**/*.ts\" && copyfiles package.json pnpm-lock.yaml dist",
    "api": "node dist/app.js",
    "web": "node dist/web.js",
    "start": "concurrently \"pnpm api\" \"pnpm web\"",
    "apiDev": "tsnd -r tsconfig-paths/register --respawn src/app.ts",
    "webDev": "tsnd -r tsconfig-paths/register --respawn src/web.ts",
    "dev": "concurrently \"pnpm apiDev\" \"pnpm webDev\""
  }
}
```

### api

> [!abstract]
>
> 正确的返回 `status:true`
>
> 错误的返回 `status:false`
>
> - 错误时返回对应的提示信息
> - 是一个数组 方便循环后展示

> [!quote] apifox
>
> [详细接口信息](https://apifox.com/apidoc/shared-be281861-ecda-4bec-9f76-98aa3eb94160/245986425e0)

# 总结

user 和 menu 都有个默认的权限 普通的用户组的权限

设置时 需要默认保持有一个 普通的用户组的权限

# 初始化

```shell
sequelize init
```

# config

```json
{
  "development": {
    "username": "root",
    "password": "123456",
    "database": "vite-blog",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  }
}
```

# 模型与迁移

## Email

### 命令

```shell
sequelize model:generate --name Email --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
// 引入验证
const { emailReg, codeReg } = require("@/routes/user/reg/RegExp")
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Email.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "邮箱不能为空哦~" },
          notEmpty: { msg: "邮箱不能为空哦~" },
          is: {
            args: emailReg.reg,
            msg: emailReg.msg,
          },
        },
      },
      regCode: {
        type: DataTypes.INTEGER(9),
        is: { args: codeReg.reg, msg: codeReg.msg },
      },
      forgetCode: {
        type: DataTypes.INTEGER(9),
        is: { args: codeReg.reg, msg: codeReg.msg },
      },
      regExpiresAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "只允许设置日期字符串哦~" },
          get(value) {
            return new Date(value)
          },
        },
      },
      forgetExpiresAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "只允许设置日期字符串哦~" },
          get(value) {
            return new Date(value)
          },
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Email",
    }
  )
  return Email
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Emails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      regCode: {
        type: Sequelize.INTEGER(9),
      },
      forgetCode: {
        type: Sequelize.INTEGER(9),
      },
      regExpiresAt: {
        type: Sequelize.DATE,
      },
      forgetExpiresAt: {
        type: Sequelize.DATE,
      },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Emails")
  },
}
```

## User

### 命令

```shell
sequelize model:generate --name User --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
//导入bcryptjs模块 加密
const bcrypt = require("bcryptjs")
// 引入验证
const {
  accountReg,
  nickNameReg,
  pwdReg,
  emailReg,
} = require("@/routes/user/reg/RegExp")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一个用户可以有多篇文章
      User.hasMany(models.Article)
      // 一个用户有一个用户信息
      User.hasOne(models.UserInfo)
    }
  }
  User.init(
    {
      account: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "账号不能为空哦~" },
          notEmpty: { msg: "账号不能为空哦~" },
          is: {
            args: accountReg.reg,
            msg: accountReg.msg,
          },
          async isUnique(value) {
            const findOne = await sequelize.models.User.findOne({
              where: { account: value },
            })
            if (findOne) throw new Error("用户已存在哦~")
          },
        },
      },
      nickName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "用户名不能为空哦~" },
          notEmpty: { msg: "用户名不能为空哦~" },
          is: {
            args: nickNameReg.reg,
            msg: nickNameReg.msg,
          },
        },
      },
      pwd: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "密码不能为空哦~" },
          notEmpty: { msg: "密码不能为空哦~" },
        },
        // 使用hash加密
        set(value) {
          if (!pwdReg.reg.test(value)) throw new Error(pwdReg.msg)
          this.setDataValue("pwd", bcrypt.hashSync(value, 10))
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "邮箱不能为空哦~" },
          notEmpty: { msg: "邮箱不能为空哦~" },
          is: {
            args: emailReg.reg,
            msg: emailReg.msg,
          },
          async isUnique(value) {
            const findOne = await sequelize.models.User.findOne({
              where: { email: value },
            })
            if (findOne) {
              throw new Error("邮箱已存在~")
            }
          },
        },
      },
      avater: DataTypes.STRING,
      signer: DataTypes.STRING,
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空哦~" },
          notEmpty: { msg: "角色不能为空哦~" },
          set(value) {
            if (!Array.isArray(value)) throw new Error("角色必须是一个数组哦~")
            // 保证至少有个 普通用户组的权限
            this.setDataValue("role", [
              ...new Set(value.flat(Infinity), ...JSON.parse(default_user)),
            ])
          },
        },
      },
      token: DataTypes.STRING(500),
      status: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("status只能为0和1")
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )
  return User
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      nickName: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      pwd: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      avater: {
        type: Sequelize.STRING,
      },
      signer: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING(500),
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users")
  },
}
```

## UserInfo

### 命令

```shell
 sequelize model:generate --name UserInfo --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一个用户信息 属于一个用户
      UserInfo.belongsTo(models.User)
      // 一个用户可以有多篇文章
      UserInfo.hasMany(models.Article)
    }
  }
  UserInfo.init(
    {
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "文章总数不能为空哦~" },
          notEmpty: { msg: "文章总数不能为空哦~" },
          isInt: { msg: "文章总数必须要是个整数哦~" },
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空哦~" },
          notEmpty: { msg: "文章标签不能为空哦~" },
          set(value) {
            if (!Array.isArray(value))
              throw new Error("文章标签必须是一个数组哦~")
            this.setDataValue("tags", [...new Set(value.flat(Infinity))])
          },
        },
      },
      categories: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空哦~" },
          notEmpty: { msg: "文章分类不能为空哦~" },
          set(value) {
            if (!Array.isArray(value))
              throw new Error("文章分类必须是一个数组哦~")
            this.setDataValue("categories", [...new Set(value.flat(Infinity))])
          },
        },
      },
      totalWords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "总字数不能为空哦~" },
          notEmpty: { msg: "总字数不能为空哦~" },
          isInt: { msg: "文章字数必须要是个整数哦~" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户id不能为空哦~" },
          notEmpty: { msg: "用户id不能为空哦~" },
          isInt: { msg: "用户id必须要是个整数哦~" },
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "UserInfo",
    }
  )
  return UserInfo
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserInfos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pages: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      categories: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      totalWords: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // 指向 User 表
          key: "id",
        },
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserInfos")
  },
}
```

## Article

### 命令

```shell
sequelize model:generate --name Article --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一篇文章属于一个用户
      Article.belongsTo(models.User)
      // 一篇文章属于一个用户信息
      Article.belongsTo(models.UserInfo)
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notNull: { msg: "文章标题不能为空哦~" },
          notEmpty: { msg: "文章标题不能为空哦~" },
          len: { args: [1, 60], msg: "文章标题长度必须在1-60之间哦~" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "文章内容不能为空哦~" },
          notEmpty: { msg: "文章内容不能为空哦~" },
        },
      },
      author: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "文章作者不能为空哦~" },
          notEmpty: { msg: "文章作者不能为空哦~" },
          len: { args: [1, 32], msg: "文章作者长度必须在1-32之间哦~" },
        },
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空哦~" },
          notEmpty: { msg: "文章分类不能为空哦~" },
          len: { args: [1, 10], msg: "文章分类长度必须在1-10之间哦~" },
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空哦~" },
          notEmpty: { msg: "文章标签不能为空哦~" },
          set(value) {
            if (!Array.isArray(value))
              throw new Error("文章标签必须是一个数组哦~")
            this.setDataValue("tags", [...new Set(value.flat(Infinity))])
          },
        },
      },
      carousel: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1)
              throw new Error("carousel只能为0和1")
          },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "文章描述长度必须在1-255之间哦~" },
        },
      },
      poster: DataTypes.STRING,
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "文章字数不能为空哦~" },
          notEmpty: { msg: "文章字数不能为空哦~" },
          isInt: { msg: "文章字数必须要是个整数哦~" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户id不能为空哦~" },
          notEmpty: { msg: "用户id不能为空哦~" },
          isInt: { msg: "用户id必须要是个整数哦~" },
        },
      },
      userInfoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户信息id不能为空哦~" },
          notEmpty: { msg: "用户信息id不能为空哦~" },
          isInt: { msg: "用户信息id必须要是个整数哦~" },
        },
      },
      status: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("status只能为0和1")
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  )
  return Article
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      carousel: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      desc: {
        type: Sequelize.STRING,
      },
      poster: {
        type: Sequelize.STRING,
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      userInfoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "UserInfos",
          key: "id",
        },
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Articles")
  },
}
```

## Menu

### 命令

```shell
sequelize model:generate --name Menu --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 很多子菜单
      Menu.hasMany(models.MenuList, { as: "children" }) // 指定别名 'children'
    }
  }
  Menu.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "菜单title不能为空哦~" },
          notEmpty: { msg: "菜单title不能为空哦~" },
          len: { arg: [1, 32], msg: "菜单长度必须在1-32之间哦~" },
        },
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "菜单icon不能为空哦~" },
          notEmpty: { msg: "菜单icon不能为空哦~" },
          isSvg(value) {
            if (!(value.includes("<svg") && value.includes("</svg>"))) {
              throw new Error("icon必须要是一个svg哦~")
            }
          },
        },
      },
      to: DataTypes.STRING,
      layout: DataTypes.JSON,
      bannerImg: DataTypes.JSON,
      status: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("status只能为0和1")
          },
        },
      },
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空哦~" },
          notEmpty: { msg: "角色不能为空哦~" },
          set(value) {
            if (!Array.isArray(value)) throw new Error("角色必须是一个数组哦~")
            // 保证至少有个 普通用户组的权限
            this.setDataValue("role", [
              ...new Set(value.flat(Infinity), ...JSON.parse(default_user)),
            ])
          },
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Menu",
    }
  )
  return Menu
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Menus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING,
      },
      layout: {
        type: Sequelize.JSON,
      },
      bannerImg: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: Sequelize.JSON,
        allowNull: false,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menus")
  },
}
```

## MenuList

### 命令

```shell
sequelize model:generate --name MenuList --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class MenuList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MenuList.belongsTo(models.Menu, { foreignKey: "MenuId", as: "children" }) // 指定别名 'children'
    }
  }
  MenuList.init(
    {
      menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "菜单id不能为空哦~" },
          notEmpty: { msg: "菜单id不能为空哦~" },
          isInt: { msg: "菜单id必须要是个整数哦~" },
        },
      },
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单title不能为空哦~" },
          notEmpty: { msg: "子菜单title不能为空哦~" },
          len: { arg: [1, 32], msg: "菜单长度必须在1-32之间哦~" },
        },
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单icon不能为空哦~" },
          notEmpty: { msg: "子菜单icon不能为空哦~" },
          isSvg(value) {
            if (!(value.includes("<svg") && value.includes("</svg>"))) {
              throw new Error("icon必须要是一个svg哦~")
            }
          },
        },
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单to不能为空哦~" },
          notEmpty: { msg: "子菜单to不能为空哦~" },
        },
      },
      bannerImg: DataTypes.JSON,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "MenuList",
    }
  )
  return MenuList
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MenuLists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      menuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Menus",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bannerImg: {
        type: Sequelize.JSON,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MenuLists")
  },
}
```

## Setting

### 命令

```shell
sequelize model:generate --name Setting --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          async isUnique(value) {
            const find = await Setting.findOne({ where: { name: value } })
            if (find) throw new Error("设置信息不能重复哦~")
          },
        },
      },
      content: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "设置信息长度必须在1-255之间哦~" },
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Setting",
    }
  )
  return Setting
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.STRING,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Settings")
  },
}
```

## Visitor

### 命令

```shell
sequelize model:generate --name Visitor --attributes test:string
```

### 模型

```js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Visitor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Visitor.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "访客标识不能为空哦~" },
          notEmpty: { msg: "访客标识不能为空哦~" },
          async isUnique(value) {
            const find = await Visitor.findOne({ where: { name: value } })
            if (find) throw new Error("访客标识不能重复哦")
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Visitor",
      timestamps: false,
    }
  )
  return Visitor
}
```

### 迁移

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Visitors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Visitors")
  },
}
```

# 种子

## user

### 命令

```shell
sequelize seed:generate --name user
```

### 种子

```js
"use strict"
const bcrypt = require("bcryptjs")
/** @type {import('sequelize-cli').Migration} */
// 导入环境变量
require("dotenv").config()
// 引入普通用户 权限组
const default_user = JSON.parse(process.env.default_user)
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []
    const counts = 50
    const roles = [...new Set([...default_user, "admin", "other"])]
    const setRole = (i) => {
      if (i === 1) return JSON.stringify(["admin", "webDev"])
      return JSON.stringify([
        ...new Set([roles[Math.floor(Math.random() * roles.length)]]),
      ])
    }
    for (let i = 1; i <= counts; i++) {
      users.push({
        account: `test${i}`,
        nickName: "test",
        pwd: bcrypt.hashSync(`test${i}@Aa`, 10),
        email: `${i}@qq.com`,
        role: setRole(i),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert("Users", users, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  },
}
```

## article

### 命令

```shell
sequelize seed:generate --name article
```

### 种子

```js
"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 文章数组
    const articles = []
    const userInfo = []
    const counts = 50
    const category = ["前端", "后端", "软件", "游戏", "test88888"]
    const tags = ["html", "css", "js", "test8888"]

    for (let i = 1; i <= counts; i++) {
      const curAuthor = `test${i}`
      const content = `文章的内容...${i}`
      const id = i

      const article = {
        title: `文章的title${i}`,
        content,
        author: curAuthor,
        category: category[Math.floor(Math.random() * category.length)],
        tags: JSON.stringify([tags[Math.floor(Math.random() * tags.length)]]),
        userId: id, //与user id 对应
        userInfoId: id, // 与 userinfo id对应
        carousel: [0, 1][Math.floor(Math.random() * 2)],
        desc: `文章的描述${i}`,
        length: content.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const user = {
        id: id, // 确保与 article 的 userInfoId 对应
        pages: 1,
        tags: article.tags,
        categories: JSON.stringify(article.category),
        userId: article.userId, // userid 对应
        totalWords: `${content.length}`,
      }
      articles.push(article)
      userInfo.push(user)
    }

    // 先插入 UserInfos 表数据
    await queryInterface.bulkInsert("UserInfos", userInfo, {})

    // 再插入 Articles 表数据
    await queryInterface.bulkInsert("Articles", articles, {})
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {})
    await queryInterface.bulkDelete("UserInfos", null, {})
  },
}
```

## menuList

### 命令

```shell
sequelize seed:generate --name menuList
```

### 种子

```js
"use strict"
const data = require("../mock/menulist")
/** @type {import('sequelize-cli').Migration} */
// 导入环境变量
require("dotenv").config()
// 引入普通用户 权限组
const default_user = process.env.default_user
module.exports = {
  async up(queryInterface, Sequelize) {
    const menuList = []
    let menu = data.map((item, id) => {
      if (item.children) {
        menuList.push(
          ...item.children.map((item) => ({
            menuId: id,
            name: item.name ?? `${id + 1}`,
            icon: item.icon ?? `${id + 1}`,
            to: item.to ?? `/test/${id + 1}`,
            bannerImg: JSON.stringify(item.bannerImg),
          }))
        )
      }
      return {
        name: item.name ?? `${id + 1}`,
        icon: item.icon ?? `${id + 1}`,
        to: item.to ?? `/test/${id + 1}`,
        bannerImg: JSON.stringify(item.bannerImg),
        layout: JSON.stringify(item.layout),
        role: default_user,
      }
    })
    await queryInterface.bulkInsert("Menus", menu, {})
    await queryInterface.bulkInsert("MenuLists", menuList, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Menus", null, {})
    await queryInterface.bulkDelete("MenuLists", null, {})
  },
}
```

## setting

### 命令

```shell
sequelize seed:generate --name setting
```

### 种子

```js
"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Settings",
      [
        {
          name: "announce",
          content:
            "公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容",
        },
        {
          name: "copyright",
          content: "©2022-2023",
        },
        {
          name: "createWedbAt",
          content: `${new Date()}`,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Settings", null, {})
  },
}
```
