// 模拟
module.exports = [
  {
    name: "作品",
    routeName: "piece",
    icon: "i-mdi:collection",
    // 默认值
    layout: {
      width: "70px",
      left: "-15px",
      top: "30px",
    },
    role: ["user"],
    children: [
      {
        name: "piece1",
        routeName: "piece1",
        to: "/note/test",
        icon: "i-mdi:collection",
        bannerImg: {
          dark: 'url("https://haowallpaper.com/link/common/file/previewFileImg/15839280654553408")',
          light:
            'url("https://haowallpaper.com/link/common/file/previewFileImg/15556743616106816")',
          height: "50vh",
        },
      },
      {
        name: "piece2",
        routeName: "piece2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "笔记",
    routeName: "note",
    icon: "i-lucide:notebook-pen",
    role: ["user"],
    children: [
      {
        name: "note1",
        routeName: "note1",
        to: "/note/test",
        icon: "i-mdi:collection",
      },
      {
        name: "note2",
        routeName: "note2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "筛选",
    routeName: "filter",
    icon: "i-tdesign:filter-3-filled",
    role: ["user"],
    children: [
      {
        name: "filter1",
        routeName: "filter1",
        to: "/note/test",
        icon: "i-mdi:collection",
      },
      {
        name: "filter2",
        routeName: "filter2",
        to: "/note/test2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "图库",
    routeName: "gallery",
    icon: "i-jam:picture-f",
    role: ["user"],
  },
  {
    name: "留言板",
    routeName: "message board",
    icon: "i-uil:message",
    role: ["user"],
  },
  {
    name: "友链",
    routeName: "friendly link",
    icon: "i-heroicons-solid:link",
    role: ["user"],
  },
]
