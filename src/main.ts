import { createApp } from "vue"
import App from "./App.vue"
// 引入 插件
import plugins from "@/plugins"
// 创建 app 和使用 插件
createApp(App).use(plugins)
