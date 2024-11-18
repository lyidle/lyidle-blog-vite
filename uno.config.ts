import presetIcons from "@unocss/preset-icons"
import presetWind from "@unocss/preset-wind"
import { defineConfig } from "unocss"

export default defineConfig({
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
  ],
})
