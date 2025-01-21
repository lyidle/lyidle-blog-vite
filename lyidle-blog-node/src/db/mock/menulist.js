// 模拟
module.exports = [
  {
    name: "作品",
    icon: "i-mdi:collection",
    // 默认值
    layout: {
      width: "70px",
      left: "-15px",
      top: "30px",
    },
    role: ["user"],
    titleTo: "/piece/piece1",
    children: [
      {
        name: "piece1",
        to: "/piece/piece1",
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
        to: "/piece/piece2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "笔记",
    icon: "i-lucide:notebook-pen",
    role: ["user"],
    children: [
      {
        name: "note1",
        to: "/note/note1",
        icon: "i-mdi:collection",
      },
      {
        name: "note2",
        to: "/note/note2",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "筛选",
    icon: "i-tdesign:filter-3-filled",
    role: ["user"],
    children: [
      {
        name: "标签",
        to: "/filter/tags",
        icon: "i-mdi:collection",
      },
      {
        name: "分类",
        to: "/filter/categories",
        icon: "i-mdi:collection",
      },
      {
        name: "文章",
        to: "/filter/docs",
        icon: "i-mdi:collection",
      },
    ],
  },
  {
    name: "图库",
    icon: "i-jam:picture-f",
    role: ["user"],
  },
  {
    name: "留言板",
    icon: "i-uil:message",
    role: ["user"],
    titleTo: "/comments",
  },
  {
    name: "友链",
    icon: "i-heroicons-solid:link",
    role: ["user"],
  },
]
