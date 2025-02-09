<template>
  <!-- https://www.jssolo.com/note/801 -->
  <div class="dynamic_wave">
    <svg
      class="dynamic_wave_svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="dynamic_wave_g">
        <use xlink:href="#gentle-wave" x="50" y="0" :fill="oneColor" />
        <use xlink:href="#gentle-wave" x="50" y="3" :fill="twoColor" />
        <use xlink:href="#gentle-wave" x="50" y="6" :fill="threeColor" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts" name="WavesAnimation">
withDefaults(
  defineProps<{ oneColor: string; twoColor: string; threeColor: string }>(),
  {
    oneColor: "#eef8ff",
    twoColor: "#eef8ff",
    threeColor: "#eef8ff",
  }
)
</script>

<style scoped lang="scss">
.dynamic_wave_g > use {
  animation: move-forever 40s linear infinite;
}
.dynamic_wave_g > use:nth-child(1) {
  animation-duration: 10s;
}
.dynamic_wave_g > use:nth-child(2) {
  animation-duration: 5s;
}
.dynamic_wave_g > use:nth-child(3) {
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate(-90px, 0%);
  }
  100% {
    transform: translate(85px, 0%);
  }
}
.dynamic_wave {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 1;
  background: var(--footer-bg);
}
.dynamic_wave_svg {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
