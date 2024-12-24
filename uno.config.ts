import presetIcons from "@unocss/preset-icons"
import presetWind from "@unocss/preset-wind"
import { defineConfig } from "unocss"

export default defineConfig({
  // rules: [
  //   [
  //     /^bg=(.*?)$/,
  //     (match) => ({
  //       background: `${match[1]} no-repeat center;background-size:cover;`,
  //     }),
  //   ],
  // ],
  presets: [
    presetIcons({
      // extraProperties: {
      //   display: 'inline-block',
      //   'vertical-align': 'middle'
      //   // ...
      // },
      // 使用cnd的方式加载
      // cdn: "https://esm.sh/",
      // collections: {
      // i-ep:iconName
      //   ep: () => import("@iconify-json/ep/icons.json").then((i) => i.default),
      // },
    }),
    presetWind(),
    // html转换的数值
  ],
})
