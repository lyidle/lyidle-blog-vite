<template>
  <span>
    <a>
      <i class="i-hugeicons:setting-07 w-1em h-1em"></i>
      {{ label }}
    </a>
    <my-popover
      :right
      :top
      :left
      :width
      :height
      :label
      :triangle
      bg="var(--header-setting-bg)"
      class="my-popover"
    >
      <template #body>
        <el-form label-width="width" class="m-5px m-l-15px">
          <el-form-item label="暗夜模式" class="isDark">
            <el-switch
              v-model="isDark"
              inline-prompt
              :active-icon="active"
              :inactive-icon="inactive"
              size="small"
              @change="handlerChange"
              class="isDarkSwitch"
            />
          </el-form-item>
        </el-form>
      </template>
    </my-popover>
  </span>
</template>

<script setup lang="ts" name="Setting">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入utils
import isDarkFn from "@/utils/isDark"
// 引入图标
import active from "@/components/icon/switch/active.vue"
import inactive from "@/components/icon/switch/inactive.vue"
const settingStore = useSettingStore()
const route = useRoute()
let isDark = ref(settingStore.isDark)
const handlerChange = (newV: boolean) => {
  settingStore.setDark(newV, route)
}
withDefaults(
  defineProps<{
    top?: string
    right?: string
    left?: string
    width?: string
    height?: string
    bg?: string
    label?: string
    triangle?: { show?: string; left?: string; right?: string }
  }>(),
  {
    label: "设置",
  }
)
onMounted(() => {
  isDarkFn(isDark.value)
})
</script>

<style scoped lang="scss">
a {
  display: flex;
  justify-content: center;
  align-items: center;
  > i {
    margin-right: 3px;
  }
}
// 暗夜模式
::v-deep(.isDark) {
  --el-text-color-regular: var(--header-setting-label-color);
  // 改变label鼠标样式
  ::v-deep(.el-form-item__label) {
    cursor: pointer;
  }
  .isDarkSwitch {
    --el-switch-on-color: var(--header-setting-btn-on);
    --el-switch-off-color: var(--header-setting-btn-off);
  }
}
</style>
