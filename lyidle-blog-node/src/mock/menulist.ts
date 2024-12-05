// 模拟
export default [
  {
    id: 1,
    title: "首页",
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
    id: 2,
    title: "作品",
    icon: "i-mdi:collection",
    redirect: "/note/test",
    // 默认值
    // layout: {
    //   width: "70px",
    //   left: "-15px",
    //   top: "30px",
    // },
    children: [
      {
        id: 1,
        oneId: 2,
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
        id: 2,
        oneId: 2,
        name: "test2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    id: 3,
    title: "笔记",
    icon: "i-lucide:notebook-pen",
    children: [
      {
        id: 1,
        oneId: 3,
        name: "test",
        to: "/note/test",
        icon: "i-mdi:collection",
      },
      {
        id: 2,
        oneId: 3,
        name: "test2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    id: 4,
    title: "筛选",
    icon: "i-tdesign:filter-3-filled",
    children: [
      {
        id: 1,
        oneId: 3,
        name: "test",
        to: "/note/test",
        icon: "i-mdi:collection",
      },
      {
        id: 2,
        oneId: 3,
        name: "test2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    id: 5,
    title: "音乐",
    icon: "i-flowbite:list-music-outline",
  },
  {
    id: 6,
    title: "图库",
    icon: "i-jam:picture-f",
  },
  {
    id: 7,
    title: "留言板",
    icon: "i-uil:message",
  },
  {
    id: 8,
    title: "友链",
    icon: "i-heroicons-solid:link",
  },
]
