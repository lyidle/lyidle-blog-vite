<template>
  <div class="preview-more flex justify-end mr-10px">
    <ul class="relative w-fit">
      <li class="custom-menu-trigger">
        <i
          class="i-ri:more-line w-1em h-1em cur-pointer !hover:color-[var(--primary-links-hover)]"
        ></i>
        <my-menu :triangle="true" top="5px" left="-50%" class="more-list">
          <my-menu-item>
            <my-anchor>
              <span @click="isShowReport = !isShowReport">举报</span>
            </my-anchor>
          </my-menu-item>
        </my-menu>
      </li>
    </ul>
    <global-report v-model="isShowReport"></global-report>
  </div>
</template>

<script setup lang="ts" name="VditorPreviewMore">
const isShowReport = defineModel<boolean>()
</script>

<style scoped lang="scss">
.preview-more {
  .more-list {
    left: unset;
    right: 0;
    transform: translateX(0%);
    ::v-deep(.title) {
      left: 75%;
      transform: unset;
    }
  }
}
</style>
