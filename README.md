# 关于

## 前端技术与框架

> [!abstract] 框架使用 `vite`
>
> 1. 使用 `normalize.css` + `scss` 初始化样式
> 2. 使用 `unocss`、`@iconify/json`、`@unocss/preset-icons`实现图标使用 `class` 按需加载
> 3. 配置自动按需导入 `unplugin-auto-import`、`unplugin-vue-components`、`unplugin-element-plus`、`element-plus`实现 `component` 下的组件便捷导入，`element-plus` 的按需加载
>    - `element-plus`
>    - 自动导入 `components` 下的组件
> 4. 配置快速命名组件 `vite-plugin-vue-setup-extend` 在 `setup` 中使用 `name=“componentName”` 来命名
> 5. 预配置 `axios` 进行封装发起请求、`lodash` 的深度克隆、`moment` 实现时间快速格式化、`pinia` 实现仓库管理等
> 6. 封装菜单组件、面板组件等，`element-plus` 组件二次封装
> 7. 使用 `vditor` 进行文章的预览与修改

## 后端技术与框架

> [!abstract] 框架使用的 `express`
>
> 1. 使用 `express` 来搭建服务
> 2. 使用 `@types/express`、`@types/node`、`typescript`、`ts-node-dev` 实现 `typescript` 开发
> 3. 使用 `tsconfig-paths` 来进行开发时路径的别名配置
> 4. 使用 `connect-history-api-fallback` 处理 `vue history`白屏
> 5. 使用 `dotenv` 实现环境变量的配置
> 6. 使用 `jsonwebtoken`、`redis` 来处理 `token`
> 7. 使用 `redis` 缓存常见的数据信息
> 8. 使用 `bcryptjs` 加密密码
> 9. 使用 `device-detector-js ip` 实现统计访客数量
> 10. 使用 `ms` 处理 时间转换 `s、h、d` 到 毫秒的互转
> 11. 使用 `dayjs` 处理时间格式，主要是邮件发送展示的时间需要
> 12. 使用 `sharp`、`gifsicle` 压缩图片
> 13. 使用 `uuid` 生成唯一标识
> 14. 使用 `multer`、`mime-types` 解决文件上传 相关问题
> 15. 使用 `nodemailer` 来进行发送右键 代码
> 16. 使用 `cors` 解决跨域问题
> 17. 使用 `morgan` 记录日志
> 18. 使用 `sequelize`、`sequelize-cli`、`mysql2`来处理 `mysql` 数据库
> 19. 使用 `copyfiles`、`rimraf` 来处理 `ts` 打包问题
> 20. 使用 `concurrently` 同时开启 接口和网站 的运行；也可以修改一下代码和文件结构 分离界面和接口
> 21. 使用自定义替换别名打包 询问 gpt + 自己改了点错误 别名只配了一个 `“@/*”` 代表 `/src`
>     - 使用 `tsc-alias` 引入的 `js` 文件使用别名没有替换，使用了 `sequelize-cli` 自动生成的是 `js` 文件
>     - 或者使用 `module-alias` 替换也行
> 22. 使用 `minify` 压缩代码
> 23. 使用 `node-schedule` 来进行清除无效的文件

## 杂项

> [!abstract]
>
> 1. 拥有后台管理系统、账号管理、收藏管理、菜单管理、权限管理、Banner 可以后台设置（根据菜单自动生成与删除）、举报系统、系统消息管理等
> 2. 敏感词默认添加了色情分类,使用的 [github](https://github.com/konsheng/Sensitive-lexicon) 上的色情分类敏感词,使用的 [mint-filter](https://www.npmjs.com/package/mint-filter) 进行敏感词的添加、删除、验证
> 3. 前端主要的参考网站：[Fomalhaut](https://www.fomal.cc/)、[b 站](https://www.bilibili.com/)
> 4. 一些长文本信息使用 `pako` 来进行压缩存储到数据库中，节省空间
> 5. 临时图片默认全放到临时文件夹中，每晚凌晨 4 点清除
> 6. 使用 `sharp` 压缩图片、使用 `gifsicle` 压缩 `gif` 格式的图片

# 使用

> [!abstract]
>
> 1. 需要在根目录打包 `pnpm build:pro` 后
> 2. 再配置 ` node` 文件根目录目录 的 `.env` 文件信息,`linux` 需要安装 `redis`、`mysql（8.0以上）`、`gifsicle`
> 3. 进入文件 ` lyidle-blog-node` , 运行命令 `pnpm db:restore` 执行模型和种子的迁移
> 4. 进入文件 ` lyidle-blog-node` , 运行命令 `pnpm build` 进行打包,打开打包后的文件可以删除掉 `package.json` 中 `devDependencies` 项再进行 `pnpm i` 进行安装，最后把文件部署到对应的位置
> 5. 打开对应的前端端口就能够进行访问了~~
