import vue from "@vitejs/plugin-vue"
// setup 扩展，用来定义组件名
import VueSetupExtend from "vite-plugin-vue-setup-extend"
// 自动导入
import AutoImport from "unplugin-auto-import/vite"
// 自动导入组件
import Components from "unplugin-vue-components/vite"
// 按需引入element-plus
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
// element-plus样式
import ElementPlus from "unplugin-element-plus/vite"
// UnoCSS
import UnoCSS from "unocss/vite"

export default () => {
  return [
    vue(),
    UnoCSS(),
    // setup name
    VueSetupExtend(),
    AutoImport({
      // 自动导入的插件
      imports: [
        // vue相关的 如ref onMounted等
        "vue",
        // 路由 如 useRoute useRouter等
        "vue-router",
        // 仓库 如 createPinia等
        "pinia",
      ],
      // 生成  auto-imports.d.ts文件
      dts: true,
      resolvers: [
        // 按需引入element-plus
        ElementPlusResolver(),
      ],
    }),
    // 按需引入element-plus样式
    ElementPlus({}),
    Components({
      //imports指定组件所在目录，默认为src/components
      // dirs: ["src/components"],
      // 生成 components.d.ts文件
      dts: true,
      resolvers: [
        // element-plus解析器
        ElementPlusResolver(),
      ],
      // 开启命名空间 以components下的文件为前缀
      directoryAsNamespace: true,
    }),
  ]
}
