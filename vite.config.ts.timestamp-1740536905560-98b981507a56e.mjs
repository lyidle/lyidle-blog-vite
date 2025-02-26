// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.0_sass@1.81.0/node_modules/vite/dist/node/index.js";
import { resolve as resolve2 } from "path";

// config/vite.config/build.ts
var build_default = {
  outDir: "lyidle-blog-node/src/static/dist",
  assetsDir: "assets",
  emptyOutDir: true,
  rollupOptions: {
    // 输出
    output: {
      // 入口文件名
      entryFileNames: "assets/js/[name]-[hash].js",
      // 块文件名
      chunkFileNames: "assets/js/[name]-[hash].js",
      // 手动分块
      // 资源文件名
      assetFileNames: (assetInfo) => {
        if (assetInfo.name.endsWith(".css")) {
          return "assets/css/[name].[hash][extname]";
        }
        if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
          return "assets/images/[name].[hash][extname]";
        }
        if (/\.(ttf|woff|woff2|eot)$/.test(assetInfo.name)) {
          return "assets/fonts/[name].[hash][extname]";
        }
        return "assets/other/[name].[hash][extname]";
      }
    }
  }
};

// config/vite.config/plugin.ts
import vue from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/@vitejs+plugin-vue@5.2.0_vite@5.4.11_@types+node@22.9.0_sass@1.81.0__vue@3.5.13_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueSetupExtend from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/vite-plugin-vue-setup-extend@0.4.0_vite@5.4.11_@types+node@22.9.0_sass@1.81.0_/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import AutoImport from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/unplugin-auto-import@0.18.4_@nuxt+kit@3.14.159_rollup@4.27.2__@vueuse+core@9.13.0_vue@3.5.13__pyqa64yvx7n2yumszjwjn2ehpe/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.26.2_@nuxt+kit@3.14.159_rollup@4.27.2__rollup@_ro56abidtyzvqito7zrbdwx5be/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.26.2_@nuxt+kit@3.14.159_rollup@4.27.2__rollup@_ro56abidtyzvqito7zrbdwx5be/node_modules/unplugin-vue-components/dist/resolvers.js";
import ElementPlus from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/unplugin-element-plus@0.8.0_rollup@4.27.2/node_modules/unplugin-element-plus/dist/vite.mjs";
import UnoCSS from "file:///C:/Users/91251/Documents/GitHub/lyidle-blog-vite/node_modules/.pnpm/unocss@0.64.1_postcss@8.4.49_rollup@4.27.2_vite@5.4.11_@types+node@22.9.0_sass@1.81.0__vue@3.5.13_typescript@5.6.3_/node_modules/unocss/dist/vite.mjs";
var plugin_default = () => {
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
        "pinia"
      ],
      // 生成  auto-imports.d.ts文件
      dts: true,
      resolvers: [
        // 按需引入element-plus
        ElementPlusResolver()
      ]
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
        ElementPlusResolver()
      ],
      // 开启命名空间 以components下的文件为前缀
      directoryAsNamespace: true
    })
  ];
};

// config/vite.config/scss.ts
import { resolve, relative } from "path";
import { readdirSync, statSync } from "fs";
var scss_default = (dirPath, alias = "@/styles/variable") => {
  function getAllScssFiles(directory) {
    let scssFiles2 = [];
    const files = readdirSync(directory);
    files.forEach((file) => {
      const filePath = resolve(directory, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        scssFiles2 = scssFiles2.concat(getAllScssFiles(filePath));
      } else if (file.endsWith(".scss")) {
        scssFiles2.push(filePath);
      }
    });
    return scssFiles2;
  }
  const scssFiles = getAllScssFiles(dirPath);
  const result = scssFiles.map((file) => {
    const relativePath = relative(dirPath, file).replace(/\\/g, "/");
    return `@use "${alias}/${relativePath}" as *;`;
  }).join("\n") + `
  @use "@/styles/mixins.scss" as *;
  @use "@/styles/animations.scss" as *;
`;
  return result;
};

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\91251\\Documents\\GitHub\\lyidle-blog-vite";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    // 静态路径
    publicDir: "public",
    // 打包配置
    build: build_default,
    // 插件
    plugins: plugin_default(),
    resolve: {
      alias: {
        // @别名
        "@": resolve2(__vite_injected_original_dirname, "src"),
        public: resolve2(__vite_injected_original_dirname, "public")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // javascriptEnabled: true,
          // scss全局变量的配置
          additionalData: scss_default(
            resolve2(__vite_injected_original_dirname, "src/styles/variable")
          ),
          sassOptions: { quietDeps: true },
          api: "modern-compiler"
        }
      }
    },
    // 代理跨域
    server: {
      // https: {
      //   key: fs.readFileSync("certs/certkey.pem"),
      //   cert: fs.readFileSync("certs/fullchain.pem"),
      // },
      proxy: {
        // 运行时的反代配置
        [env.VITE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          // 替换 /api/assets node后就是node的静态路径
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API + "/assets"}`), "")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL3ZpdGUuY29uZmlnL2J1aWxkLnRzIiwgImNvbmZpZy92aXRlLmNvbmZpZy9wbHVnaW4udHMiLCAiY29uZmlnL3ZpdGUuY29uZmlnL3Njc3MudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFw5MTI1MVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGx5aWRsZS1ibG9nLXZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDkxMjUxXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbHlpZGxlLWJsb2ctdml0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvOTEyNTEvRG9jdW1lbnRzL0dpdEh1Yi9seWlkbGUtYmxvZy12aXRlL3ZpdGUuY29uZmlnLnRzXCI7Ly8gdml0ZS5jb25maWcudHNcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIlxyXG4vLyBub2RlIFx1OEZEQlx1ODg0Q1x1NjU4N1x1NEVGNlx1NzZGOFx1NTE3M1x1NjRDRFx1NEY1Q1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxyXG4vLyBcdTVGMTVcdTUxNjUgXHU2MjUzXHU1MzA1XHU3NkY4XHU1MTczXHU5MTREXHU3RjZFXHJcbmltcG9ydCBidWlsZCBmcm9tIFwiLi9jb25maWcvdml0ZS5jb25maWcvYnVpbGRcIlxyXG4vLyBcdTVGMTVcdTUxNjUgXHU2M0QyXHU0RUY2XHU3NkY4XHU1MTczXHU5MTREXHU3RjZFXHJcbmltcG9ydCBwbHVnaW4gZnJvbSBcIi4vY29uZmlnL3ZpdGUuY29uZmlnL3BsdWdpblwiXHJcbi8vIFx1NUYxNVx1NTE2NSBzY3NzICBcdTUxNjhcdTVDNDAgXHU1M0Q4XHU5MUNGIFx1OTE0RFx1N0Y2RVx1NTFGRFx1NjU3MFxyXG5pbXBvcnQgZ2VuZXJhdGVTY3NzSW1wb3J0cyBmcm9tIFwiLi9jb25maWcvdml0ZS5jb25maWcvc2Nzc1wiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MjMwXHU1RjUzXHU1MjREXHU3M0FGXHU1ODgzXHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxyXG4gIHJldHVybiB7XHJcbiAgICAvLyBcdTk3NTlcdTYwMDFcdThERUZcdTVGODRcclxuICAgIHB1YmxpY0RpcjogXCJwdWJsaWNcIixcclxuICAgIC8vIFx1NjI1M1x1NTMwNVx1OTE0RFx1N0Y2RVxyXG4gICAgYnVpbGQ6IGJ1aWxkLFxyXG4gICAgLy8gXHU2M0QyXHU0RUY2XHJcbiAgICBwbHVnaW5zOiBwbHVnaW4oKSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAvLyBAXHU1MjJCXHU1NDBEXHJcbiAgICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcclxuICAgICAgICBwdWJsaWM6IHJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIC8vIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgLy8gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzY4NFx1OTE0RFx1N0Y2RVxyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGdlbmVyYXRlU2Nzc0ltcG9ydHMoXHJcbiAgICAgICAgICAgIHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zdHlsZXMvdmFyaWFibGVcIilcclxuICAgICAgICAgICksXHJcbiAgICAgICAgICBzYXNzT3B0aW9uczogeyBxdWlldERlcHM6IHRydWUgfSxcclxuICAgICAgICAgIGFwaTogXCJtb2Rlcm4tY29tcGlsZXJcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIFx1NEVFM1x1NzQwNlx1OERFOFx1NTdERlxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIC8vIGh0dHBzOiB7XHJcbiAgICAgIC8vICAga2V5OiBmcy5yZWFkRmlsZVN5bmMoXCJjZXJ0cy9jZXJ0a2V5LnBlbVwiKSxcclxuICAgICAgLy8gICBjZXJ0OiBmcy5yZWFkRmlsZVN5bmMoXCJjZXJ0cy9mdWxsY2hhaW4ucGVtXCIpLFxyXG4gICAgICAvLyB9LFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIC8vIFx1OEZEMFx1ODg0Q1x1NjVGNlx1NzY4NFx1NTNDRFx1NEVFM1x1OTE0RFx1N0Y2RVxyXG4gICAgICAgIFtlbnYuVklURV9BUEldOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1NFUlZFLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgLy8gXHU2NkZGXHU2MzYyIC9hcGkvYXNzZXRzIG5vZGVcdTU0MEVcdTVDMzFcdTY2MkZub2RlXHU3Njg0XHU5NzU5XHU2MDAxXHU4REVGXHU1Rjg0XHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cclxuICAgICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke2Vudi5WSVRFX0FQSSArIFwiL2Fzc2V0c1wifWApLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9XHJcbn0pXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcOTEyNTFcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxseWlkbGUtYmxvZy12aXRlXFxcXGNvbmZpZ1xcXFx2aXRlLmNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcOTEyNTFcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxseWlkbGUtYmxvZy12aXRlXFxcXGNvbmZpZ1xcXFx2aXRlLmNvbmZpZ1xcXFxidWlsZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvOTEyNTEvRG9jdW1lbnRzL0dpdEh1Yi9seWlkbGUtYmxvZy12aXRlL2NvbmZpZy92aXRlLmNvbmZpZy9idWlsZC50c1wiO2V4cG9ydCBkZWZhdWx0IHtcclxuICBvdXREaXI6IFwibHlpZGxlLWJsb2ctbm9kZS9zcmMvc3RhdGljL2Rpc3RcIixcclxuICBhc3NldHNEaXI6IFwiYXNzZXRzXCIsXHJcbiAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgLy8gXHU4RjkzXHU1MUZBXHJcbiAgICBvdXRwdXQ6IHtcclxuICAgICAgLy8gXHU1MTY1XHU1M0UzXHU2NTg3XHU0RUY2XHU1NDBEXHJcbiAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXHJcbiAgICAgIC8vIFx1NTc1N1x1NjU4N1x1NEVGNlx1NTQwRFxyXG4gICAgICBjaHVua0ZpbGVOYW1lczogXCJhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxyXG4gICAgICAvLyBcdTYyNEJcdTUyQThcdTUyMDZcdTU3NTdcclxuICAgICAgLy8gXHU4RDQ0XHU2RTkwXHU2NTg3XHU0RUY2XHU1NDBEXHJcbiAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvOiBhbnkpID0+IHtcclxuICAgICAgICAvLyBjc3NcclxuICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUuZW5kc1dpdGgoXCIuY3NzXCIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gXCJhc3NldHMvY3NzL1tuYW1lXS5baGFzaF1bZXh0bmFtZV1cIlxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBcdTU2RkVcdTcyNDdcclxuICAgICAgICBpZiAoL1xcLihwbmd8anBlP2d8Z2lmfHN2Z3x3ZWJwfGljbykkLy50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFwiYXNzZXRzL2ltYWdlcy9bbmFtZV0uW2hhc2hdW2V4dG5hbWVdXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gXHU1QjU3XHU0RjUzXHJcbiAgICAgICAgaWYgKC9cXC4odHRmfHdvZmZ8d29mZjJ8ZW90KSQvLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gXCJhc3NldHMvZm9udHMvW25hbWVdLltoYXNoXVtleHRuYW1lXVwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFx1NTE3Nlx1NEVENlxyXG4gICAgICAgIHJldHVybiBcImFzc2V0cy9vdGhlci9bbmFtZV0uW2hhc2hdW2V4dG5hbWVdXCJcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDkxMjUxXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbHlpZGxlLWJsb2ctdml0ZVxcXFxjb25maWdcXFxcdml0ZS5jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDkxMjUxXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbHlpZGxlLWJsb2ctdml0ZVxcXFxjb25maWdcXFxcdml0ZS5jb25maWdcXFxccGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy85MTI1MS9Eb2N1bWVudHMvR2l0SHViL2x5aWRsZS1ibG9nLXZpdGUvY29uZmlnL3ZpdGUuY29uZmlnL3BsdWdpbi50c1wiO2ltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiXHJcbi8vIHNldHVwIFx1NjI2OVx1NUM1NVx1RkYwQ1x1NzUyOFx1Njc2NVx1NUI5QVx1NEU0OVx1N0VDNFx1NEVGNlx1NTQwRFxyXG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmRcIlxyXG4vLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIlxyXG4vLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIlxyXG4vLyBcdTYzMDlcdTk3MDBcdTVGMTVcdTUxNjVlbGVtZW50LXBsdXNcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIlxyXG4vLyBlbGVtZW50LXBsdXNcdTY4MzdcdTVGMEZcclxuaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gXCJ1bnBsdWdpbi1lbGVtZW50LXBsdXMvdml0ZVwiXHJcbi8vIFVub0NTU1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiXHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcclxuICByZXR1cm4gW1xyXG4gICAgdnVlKCksXHJcbiAgICBVbm9DU1MoKSxcclxuICAgIC8vIHNldHVwIG5hbWVcclxuICAgIFZ1ZVNldHVwRXh0ZW5kKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU3Njg0XHU2M0QyXHU0RUY2XHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAvLyB2dWVcdTc2RjhcdTUxNzNcdTc2ODQgXHU1OTgycmVmIG9uTW91bnRlZFx1N0I0OVxyXG4gICAgICAgIFwidnVlXCIsXHJcbiAgICAgICAgLy8gXHU4REVGXHU3NTMxIFx1NTk4MiB1c2VSb3V0ZSB1c2VSb3V0ZXJcdTdCNDlcclxuICAgICAgICBcInZ1ZS1yb3V0ZXJcIixcclxuICAgICAgICAvLyBcdTRFRDNcdTVFOTMgXHU1OTgyIGNyZWF0ZVBpbmlhXHU3QjQ5XHJcbiAgICAgICAgXCJwaW5pYVwiLFxyXG4gICAgICBdLFxyXG4gICAgICAvLyBcdTc1MUZcdTYyMTAgIGF1dG8taW1wb3J0cy5kLnRzXHU2NTg3XHU0RUY2XHJcbiAgICAgIGR0czogdHJ1ZSxcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgLy8gXHU2MzA5XHU5NzAwXHU1RjE1XHU1MTY1ZWxlbWVudC1wbHVzXHJcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgICAvLyBcdTYzMDlcdTk3MDBcdTVGMTVcdTUxNjVlbGVtZW50LXBsdXNcdTY4MzdcdTVGMEZcclxuICAgIEVsZW1lbnRQbHVzKHt9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAvL2ltcG9ydHNcdTYzMDdcdTVCOUFcdTdFQzRcdTRFRjZcdTYyNDBcdTU3MjhcdTc2RUVcdTVGNTVcdUZGMENcdTlFRDhcdThCQTRcdTRFM0FzcmMvY29tcG9uZW50c1xyXG4gICAgICAvLyBkaXJzOiBbXCJzcmMvY29tcG9uZW50c1wiXSxcclxuICAgICAgLy8gXHU3NTFGXHU2MjEwIGNvbXBvbmVudHMuZC50c1x1NjU4N1x1NEVGNlxyXG4gICAgICBkdHM6IHRydWUsXHJcbiAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgIC8vIGVsZW1lbnQtcGx1c1x1ODlFM1x1Njc5MFx1NTY2OFxyXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgXSxcclxuICAgICAgLy8gXHU1RjAwXHU1NDJGXHU1NDdEXHU1NDBEXHU3QTdBXHU5NUY0IFx1NEVFNWNvbXBvbmVudHNcdTRFMEJcdTc2ODRcdTY1ODdcdTRFRjZcdTRFM0FcdTUyNERcdTdGMDBcclxuICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXHJcbiAgICB9KSxcclxuICBdXHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFw5MTI1MVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGx5aWRsZS1ibG9nLXZpdGVcXFxcY29uZmlnXFxcXHZpdGUuY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFw5MTI1MVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGx5aWRsZS1ibG9nLXZpdGVcXFxcY29uZmlnXFxcXHZpdGUuY29uZmlnXFxcXHNjc3MudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzkxMjUxL0RvY3VtZW50cy9HaXRIdWIvbHlpZGxlLWJsb2ctdml0ZS9jb25maWcvdml0ZS5jb25maWcvc2Nzcy50c1wiOy8vIG5vZGUgXHU4RkRCXHU4ODRDXHU2NTg3XHU0RUY2XHU3NkY4XHU1MTczXHU2NENEXHU0RjVDXHJcbmltcG9ydCB7IHJlc29sdmUsIHJlbGF0aXZlIH0gZnJvbSBcInBhdGhcIlxyXG5pbXBvcnQgeyByZWFkZGlyU3luYywgc3RhdFN5bmMgfSBmcm9tIFwiZnNcIlxyXG5cclxuLy8gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzY4NFx1OTE0RFx1N0Y2RVxyXG5leHBvcnQgZGVmYXVsdCAoXHJcbiAgZGlyUGF0aDogc3RyaW5nLFxyXG4gIGFsaWFzOiBzdHJpbmcgPSBcIkAvc3R5bGVzL3ZhcmlhYmxlXCJcclxuKTogc3RyaW5nID0+IHtcclxuICAvKipcclxuICAgKiBcdTkwMTJcdTVGNTJcdTgzQjdcdTUzRDZcdTc2RUVcdTVGNTVcdTRFMkRcdTYyNDBcdTY3MDkgLnNjc3MgXHU2NTg3XHU0RUY2XHU3Njg0XHU4REVGXHU1Rjg0XHUzMDAyXHJcbiAgICogQHBhcmFtIGRpcmVjdG9yeSAtIFx1OTcwMFx1ODk4MVx1NjQxQ1x1N0QyMlx1NzY4NFx1NzZFRVx1NUY1NVx1OERFRlx1NUY4NFx1MzAwMlxyXG4gICAqIEByZXR1cm5zIFx1NjI0MFx1NjcwOSAuc2NzcyBcdTY1ODdcdTRFRjZcdTc2ODRcdTdFRERcdTVCRjlcdThERUZcdTVGODRcdTY1NzBcdTdFQzRcdTMwMDJcclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRBbGxTY3NzRmlsZXMoZGlyZWN0b3J5OiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICBsZXQgc2Nzc0ZpbGVzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBjb25zdCBmaWxlcyA9IHJlYWRkaXJTeW5jKGRpcmVjdG9yeSlcclxuICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcclxuICAgICAgY29uc3QgZmlsZVBhdGggPSByZXNvbHZlKGRpcmVjdG9yeSwgZmlsZSlcclxuICAgICAgY29uc3Qgc3RhdCA9IHN0YXRTeW5jKGZpbGVQYXRoKVxyXG4gICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XHJcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2NjJGXHU3NkVFXHU1RjU1XHVGRjBDXHU5MDEyXHU1RjUyXHU4M0I3XHU1M0Q2XHU1QjUwXHU3NkVFXHU1RjU1XHU0RTJEXHU3Njg0IC5zY3NzIFx1NjU4N1x1NEVGNlxyXG4gICAgICAgIHNjc3NGaWxlcyA9IHNjc3NGaWxlcy5jb25jYXQoZ2V0QWxsU2Nzc0ZpbGVzKGZpbGVQYXRoKSlcclxuICAgICAgfSBlbHNlIGlmIChmaWxlLmVuZHNXaXRoKFwiLnNjc3NcIikpIHtcclxuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkYgLnNjc3MgXHU2NTg3XHU0RUY2XHVGRjBDXHU2REZCXHU1MkEwXHU1MjMwXHU3RUQzXHU2NzlDXHU2NTcwXHU3RUM0XHJcbiAgICAgICAgc2Nzc0ZpbGVzLnB1c2goZmlsZVBhdGgpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHNjc3NGaWxlc1xyXG4gIH1cclxuICAvLyBcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDkgLnNjc3MgXHU2NTg3XHU0RUY2XHJcbiAgY29uc3Qgc2Nzc0ZpbGVzID0gZ2V0QWxsU2Nzc0ZpbGVzKGRpclBhdGgpXHJcbiAgY29uc3QgcmVzdWx0ID1cclxuICAgIHNjc3NGaWxlc1xyXG4gICAgICAubWFwKChmaWxlKSA9PiB7XHJcbiAgICAgICAgLy8gXHU1QzA2XHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHU4RjZDXHU2MzYyXHU0RTNBIGFsaWFzIFx1NjgzQ1x1NUYwRlxyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKGRpclBhdGgsIGZpbGUpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXHJcbiAgICAgICAgcmV0dXJuIGBAdXNlIFwiJHthbGlhc30vJHtyZWxhdGl2ZVBhdGh9XCIgYXMgKjtgXHJcbiAgICAgIH0pXHJcbiAgICAgIC5qb2luKFwiXFxuXCIpICtcclxuICAgIGBcclxuICBAdXNlIFwiQC9zdHlsZXMvbWl4aW5zLnNjc3NcIiBhcyAqO1xyXG4gIEB1c2UgXCJAL3N0eWxlcy9hbmltYXRpb25zLnNjc3NcIiBhcyAqO1xyXG5gXHJcblxyXG4gIC8vIFx1NzUxRlx1NjIxMCBpbXBvcnQgXHU4QkVEXHU1M0U1XHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGNBQWMsZUFBZTtBQUV0QyxTQUFTLFdBQUFBLGdCQUFlOzs7QUNIdVcsSUFBTyxnQkFBUTtBQUFBLEVBQzVZLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLGFBQWE7QUFBQSxFQUNiLGVB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QSxNQUNyQztBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQTtBQUFBO0FBQUEsVUFHSixnQkFBZ0I7QUFBQSxZQUNkQSxTQUFRLGtDQUFXLHFCQUFxQjtBQUFBLFVBQzFDO0FBQUEsVUFDQSxhQUFhLEVBQUUsV0FBVyxLQUFLO0FBQUEsVUFDL0IsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtOLE9BQU87QUFBQTtBQUFBLFFBRUwsQ0FBQyxJQUFJLFFBQVEsR0FBRztBQUFBLFVBQ2QsUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUE7QUFBQSxVQUVkLFNBQVMsQ0FBQyxTQUNSLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxJQUFJLFdBQVcsU0FBUyxFQUFFLEdBQUcsRUFBRTtBQUFBLFFBQy9EO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJzY3NzRmlsZXMiLCAicmVzb2x2ZSJdCn0K
