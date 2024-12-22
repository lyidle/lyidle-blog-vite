// 模拟
module.exports = [
  {
    name: "首页",
    icon: "i-ep:home-filled",
    to: "/home",
    bannerImg: {
      light:
        'url("https://haowallpaper.com/link/common/file/previewFileImg/15839280654553408")',
      dark: 'url("https://haowallpaper.com/link/common/file/previewFileImg/15556743616106816")',
      height: "100vh",
    },
  },
  {
    name: "作品",
    icon: "i-mdi:collection",
    to: "/note/test",
    // 默认值
    layout: {
      width: "70px",
      left: "-15px",
      top: "30px",
    },
    children: [
      {
        name: "test",
        to: "/note/test",
        icon: "i-mdi:collection",
        bannerImg: {
          dark: 'url("https://haowallpaper.com/link/common/file/previewFileImg/15839280654553408")',
          light:
            'url("https://haowallpaper.com/link/common/file/previewFileImg/15556743616106816")',
          height: "100vh",
        },
      },
      {
        name: "test2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "笔记",
    icon: "i-lucide:notebook-pen",
    children: [
      {
        name: "test",
        to: "/note/test",
        icon: "i-mdi:collection",
      },
      {
        name: "test2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "筛选",
    icon: "i-tdesign:filter-3-filled",
    children: [
      {
        name: "test",
        to: "/note/test",
        icon: "i-mdi:collection",
      },
      {
        name: "test2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "音乐",
    icon: "i-flowbite:list-music-outline",
  },
  {
    name: "图库",
    icon: "i-jam:picture-f",
  },
  {
    name: "留言板",
    icon: "i-uil:message",
  },
  {
    name: "友链",
    icon: "i-heroicons-solid:link",
  },
]
